
    /**
     * @fileOverview The Food selection screen
     * SubView of FoodScreen
     */

    define([
        'jquery',
        'underscore',
        'backbone',
        'text!templates/widgets/FoodScreen/Foodometer.html',
        'text!templates/widgets/FoodItem.html',
        'collections/Foods',
        'collections/FoodJournal'
    ], function($, _, Backbone, tpl, foodItem, collection, journal) {
        return Backbone.View.extend({
            tagName: 'section',
            id: 'foodScreen',
            collection: collection,
            template: _.template(tpl),
            itemTpl: _.template(foodItem),
            events: {
                'click .foodItem': 'selectFood',
                'click #foodList .boxEntry': 'showFoodItemScreen',
                'click #backToTop': 'backToTop',
                'click .item': 'selectItem',
                'click #cancelFood': 'cancelFood',
                'click #foodFavBtn': 'addFoodToFav',
                'click #saveToMeal': 'saveFoodToMeal',
                'click #saveBtn': 'saveAllItems',
                'change #serving': 'calculateNutrients'
            },

            initialize: function() {
                _.bindAll(this);
                this.initOriHandler();
            },

            initOriHandler: function(e) {
                var self = this;

                window.addEventListener('orientationchange', function(e) {
                    switch (window.orientation) {
                        case 0: // portrait mode
                            self.refreshScroll();
                            break;
                        case 90: // landscape left
                            self.refreshScroll();
                            break;
                        case -90: // landscape right
                            self.refreshScroll();
                            break;
                    }
                });
            },

            render: function() {
                this.$el.html(this.template());

                this.level1Scroll = new iScroll(this.$('#level1Food')[0], {
                    hScroll: true,
                    vScroll: false,
                    hScrollbar: false,
                    bounceLock: true,
                    bounce: false
                });

                $('#filterButtons').show();
                this.pageScroll = new iScroll(this.$('#pageScroll')[0]);
                $("span#meal").text("Lunch - (" + this.container.container.foodItems.length + ")");
                this.refreshScroll();
                return this;
            },

            refreshScroll: function() {
                var self = this;
                setTimeout(function() {
                    self.level1Scroll.refresh();
                    self.pageScroll.refresh();
                }, 100);
            },

            hideCategories: function() {
                $('#foodList').hide();
                $('.foods2').hide();
                if ($('.foodItem.lv1.selected img').attr('src')) {
                    $('.foodItem.lv1.selected img').attr('src', $('.foodItem.lv1.selected img').attr('src').replace("icon-over", "icon"));
                }
                $('.foodItem.lv1').removeClass('selected');
                $('#backToTop').hide();
            },

            /* 
             * Event when a food category is selected
             * Check whether it is level1 or level2 category
             */
            selectFood: function(e) {
                var self = this;
                var target = $(e.currentTarget);

                if (target.hasClass('lv1')) {
                    if ($(".foodItem.lv1.selected").length > 0) {
                        $('.foodItem.lv1.selected img').attr('src', $('.foodItem.lv1.selected img').attr('src').replace("icon-over", "icon"));
                        $('.foodItem.lv1').removeClass('selected');
                    }

                    target.find('img').attr('src', target.find('img').attr('src').replace("icon.", "icon-over."));
                    var name = target.attr('data-id');

                    $('.foods2').hide();
                    $('.foods2.' + name).show();
                    $('#foodList').hide();
                    $('#backToTop').hide();
                } else if (target.hasClass('lv2')) {
                    $('.foodItem.lv2').removeClass('selected');
                }

                target.addClass('selected');

                // if both level categories are selected, show foodList
                if ($('.foodItem.lv1').hasClass('selected') && $('.foodItem.lv2:visible').hasClass('selected')) {
                    // $('#foodList').show();
                    self.populateFoodList(target);
                }
                this.refreshScroll();
            },

            showFoodItemScreen: function(e) {
                var self = this;
                var target = $(e.currentTarget);
                var imgSrc = $(".lv2.selected img").attr("src");
                var id = target.attr('data-id');
                var model = this.collection.get(id);
                this.model = model;
                //this.pageScroll = null;
                self.selectedFood = model;
                self.container.container.iscroll.enable();
                self.oldHtml = this.$el.html();
                $('#filterButtons').hide();
                this.$el.html(self.itemTpl({
                    item: model.attributes,
                    imgSrc: imgSrc
                }));
                this.calculateNutrients();
                self.refreshScroll();

                if (model.attributes.favorite === true) {
                    $('#foodFavBtn').addClass('active');
                }
            },

            populateFoodList: function(el) {
                var self = this;
                var target = $(el);
                var name = target.attr('data-name');
                console.log(name);
                $('#foodList').html('');
                $('#modalMask').show().append("<img src='img/spinner.gif'/>");


                // pull foods into collection before populating screen
                this.collection.getFoods(name, function(err, res) {
                    if (err) {
                        Backbone.trigger('notify', err, 'Error getting Food List');
                        $('#modalMask').hide().html("");
                        return;
                    }
                    console.log(res[0]);
                    $('#foodList').show();
                    for (var i = 0; i < res.length; i++) {
                        var item = res[i];
                        var name = item.name || item.attributes.name;
                        var html = "<div class='boxEntry' data-id='" + item.id + "''><span id='name'>" + name + "</span>" +
                            "<span id='about'>" + "</span></div>";
                        $('#foodList').append(html);
                    }
                    self.container.container.iscroll.disable();
                    $('#modalMask').hide().html("");
                    $('#backToTop').show();
                    self.refreshScroll();
                });
            },

            backToTop: function() {
                this.pageScroll.scrollTo(0, 0, 200);
            },

            selectItem: function(e) {
                var target = $(e.currentTarget);
                target.toggleClass('selected');
            },

            cancelFood: function(doneFlag) {
                this.model = null;
                this.selectedFood = null;
                this.$el.html(this.oldHtml);
                $('#filterButtons').show();

                if (!doneFlag) {
                    //  this.level1Scroll.destroy();
                    this.pageScroll = new iScroll(this.$('#pageScroll')[0]);
                    this.level1Scroll = new iScroll(this.$('#level1Food')[0], {
                        hScroll: true,
                        vScroll: false,
                        hScrollbar: false,
                        bounceLock: true,
                        bounce: false
                    });
                }
                // this.container.container.iscroll.disable();
                this.refreshScroll();
            },

            addFoodToFav: function(e) {
                var target = $(e.currentTarget);
                var food = this.selectedFood;
                if (!food) {
                    console.warn('No Food Selected');
                    return;
                } else {
                    food.set("favorite", true);
                    target.addClass('active');
                }
            },

            saveFoodToMeal: function() {
                var food = this.selectedFood;
                if (!food) {
                    console.warn('No Food Selected');
                    return;
                } else {
                    food.set("recent", true);
                    food.attributes.serving = $("#serving").val() + " x " + $('#size').val();
                    food = this.multiplyServing($("#serving").val(), food);
                    this.container.container.foodItems.push(food);
                    console.log(this.container.container.foodItems);
                }
                $("span#meal").text("Lunch - (" + this.container.container.foodItems.length + ")");
                this.refreshScroll();
                this.cancelFood();
                // this.selectFood();
            },

            saveAllItems: function() {
                this.container.container.subViews.foodometerNav.saveFoodsToJournal();
                this.container.container.setActiveView('foodometerNav');
            },

            // When serving number changes, recalculate nutrient values
            calculateNutrients: function() {
                var servings = $('#serving').val();
                var att = this.model.attributes;
                var calories = parseFloat(att.calories) || 0;
                var fat = parseFloat(att.total_fat) || 0;
                var cholesterol = parseFloat(att.cholesterol) || 0;
                var sodium = parseFloat(att.sodium) || 0;
                var carbohydrates = parseFloat(att.total_carbohydrates) || 0;
                var fibre = parseFloat(att.fiber) || 0;
                var protein = parseFloat(att.protein) || 0;

                var el = $("#nutritionInfo");
                el.find("#totalCalories #amount").text(calories * servings);
                el.find("#fat #amount").text(fat * servings);
                el.find("#cholesterol #amount").text(cholesterol * servings);
                el.find("#sodium #amount").text(sodium * servings);
                el.find("#carbohydrates #amount").text(carbohydrates * servings);
                el.find("#dietryFibre #amount").text(fibre * servings);
                el.find("#protein #amount").text(protein * servings);

                //rda's
                el.find("#totalCalories #rda").text(Math.round((calories * servings / journal.dailyValues.calories) * 100) + "%");
                el.find("#fat #rda").text(Math.round((fat * servings / journal.dailyValues.fat) * 100) + "%");
                el.find("#cholesterol #rda").text(Math.round((cholesterol * servings / journal.dailyValues.cholesterol) * 100) + "%");
                el.find("#sodium #rda").text(Math.round((sodium * servings / journal.dailyValues.sodium) * 100) + "%");
                el.find("#carbohydrates #rda").text(Math.round((carbohydrates * servings / journal.dailyValues.carbohydrates) * 100) + "%");
                el.find("#dietryFibre #rda").text(Math.round((fibre * servings / journal.dailyValues.fibre) * 100) + "%");
                el.find("#protein #rda").text(Math.round((protein * servings / journal.dailyValues.protein) * 100) + "%");
                this.updateNutrition();
            },

            updateNutrition: function() {
                var el = $("#nutritionInfo .boxEntry");

                for (var i = 0; i < el.length; i++) {
                    var thisEl = $(el[i]);
                    var percent = thisEl.find("#rda").text() || "0%";
                    thisEl.find("#name").css("background-size", percent + " 100%");
                }

            },

            multiplyServing: function(serving, model) {
                var att = model.attributes;
                var calories = parseFloat(att.calories) || 0;
                var fat = parseFloat(att.total_fat) || 0;
                var cholesterol = parseFloat(att.cholesterol) || 0;
                var sodium = parseFloat(att.sodium) || 0;
                var carbohydrates = parseFloat(att.total_carbohydrates) || 0;
                var fibre = parseFloat(att.fiber) || 0;
                var protein = parseFloat(att.protein) || 0;

                att.calories = calories * serving;
                att.fat = fat * serving;
                att.cholesterol = cholesterol * serving;
                att.sodium = sodium * serving;
                att.carbohydrates = carbohydrates * serving;
                att.fibre = fibre * serving;
                att.protein = protein * serving;

                model.attributes = att;
                return model;
            }

        });
    });
