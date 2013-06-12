/**
 * @fileOverview The Food search Screen
 * SubView of FoodScreen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/FoodScreen/SimpleSearch.html',
    'text!templates/widgets/FoodItem.html',
    'collections/Foods',
    'collections/FoodJournal'
], function($, _, Backbone, tpl, foodItem, foods, journal) {
    return Backbone.View.extend({
        tagName : 'section',
        id      : 'simpleSearchScreen',
        template: _.template(tpl),
        itemTpl : _.template(foodItem),
        events  : {
            "click #searchImg"         : "searchFood",
            "click #xImg"              : "clearSearchField",
            "click #backToTop"         : "backToTop",
            "click #foodList .boxEntry": "showFoodItemScreen",
            'click #cancelFood'        : 'cancelFood',
            'click #foodFavBtn'        : 'addFoodToFav',
            'click #saveToMeal'        : 'saveFoodToMeal',
            'change #serving'          : 'calculateNutrients',
            'submit #searchForm'       : "searchFood"
        },

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());
            $('#filterButtons').show();
            this.listScroll = new iScroll(this.$('#scrollContainer')[0]);
            $("span#meal").text("Lunch - ("+this.container.container.foodItems.length+")");

            return this;
        },

        refreshScroll: function(){
            var self = this;
            setTimeout(function(){
                self.listScroll.refresh();
            }, 100);
        },

        searchFood: function(){
            var self = this;
            var searchTerm = $("#searchTerm").val();
            var type = $("#filter").find(":selected").text();

            if(searchTerm === null || searchTerm === ""){
                Backbone.trigger('notify', 'Please enter a search term', 'Search Error');
                return;
            }

            $('#foodList').html('');
            $('#modalMask').show().append("<img src='img/spinner.gif'/>");

            foods.singleSearch(searchTerm, type, function(err,data){
                if(err){
                    Backbone.trigger('notify', err, 'Error getting Food List');
                    $('#modalMask').hide().html("");
                    return;
                }
                if(data.length === 0){
                    $('#foodList').append("<h1>No Food Found</h1>");
                }
                $('#foodList').show();
                for(var i=0;i<data.length;i++){
                    var item = data[i];
                    var name = item.fullname || item.attributes.fullname;
                    var html = "<div class='boxEntry' data-id='"+item.id+"''><span id='name'>" +name +"</span>"+
                                "<span id='about'>" + "</span></div>";
                    $('#foodList').append(html);
                }
                self.container.container.iscroll.disable();
                $('#modalMask').hide().html("");
                $('#backToTop').show();
                self.refreshScroll();
            });
            return false;
        },

        clearSearchField: function(){
            $("#searchTerm").val("");
        },

        backToTop: function(){
            this.listScroll.scrollTo(0,0,200);
        },

        showFoodItemScreen: function(e){
            var self = this;
            var target = $(e.currentTarget);
            var id = target.attr('data-id');
            var model = foods.get(id);
            this.model = model;
            this.selectedFood = model;
            // this.oldHtml = this.$el.html();
            // this.$el.html(self.itemTpl({item:model.attributes, imgSrc:""}));

            this.oldHtml = this.$el.html();
            $('#filterButtons').hide();
            this.$el.html(self.itemTpl({item:model.attributes, imgSrc:""}));

            this.calculateNutrients();
            this.refreshScroll();
            this.listScroll = null;
        },

        cancelFood: function(){
            this.model = null;
            this.selectedFood = null;
            this.$el.html(this.oldHtml);
            $('#filterButtons').show();
            this.listScroll = new iScroll(this.$('#scrollContainer')[0]);

            this.refreshScroll();

        },

        addFoodToFav: function(){
            var food = this.selectedFood;
            if(!food){
                console.warn('No Food Selected');
                return;
            } else {
                food.set("favorite", true);
            }
        },

        saveFoodToMeal: function(){
            var food = this.selectedFood;
            if(!food){
                console.warn('No Food Selected');
                return;
            } else {
                food.attributes.serving = $("#serving").val() + " x " + $('#size').val();
                food = this.multiplyServing($("#serving").val(), food);
                this.container.container.foodItems.push(food);
                console.log(this.container.container.foodItems);
            }
            $("span#meal").text("Lunch - ("+this.container.container.foodItems.length+")");
            this.cancelFood();
        },

        calculateNutrients: function(){
            var servings = $('#serving').val();
            var att = this.model.attributes;
            var calories      = parseFloat(att.calories) || 0;
            var fat           = parseFloat(att.total_fat) || 0;
            var cholesterol   = parseFloat(att.cholesterol) || 0;
            var sodium        = parseFloat(att.sodium) || 0;
            var carbohydrates = parseFloat(att.total_carbohydrates) || 0;
            var fibre         = parseFloat(att.fiber) || 0;
            var protein       = parseFloat(att.protein) || 0;

            var el = $("#nutritionInfo");
            el.find("#totalCalories #amount").text(calories*servings);
            el.find("#fat #amount").text(fat*servings);
            el.find("#cholesterol #amount").text(cholesterol*servings);
            el.find("#sodium #amount").text(sodium*servings);
            el.find("#carbohydrates #amount").text(carbohydrates*servings);
            el.find("#dietryFibre #amount").text(fibre*servings);
            el.find("#protein #amount").text(protein*servings);

                //rda's
            el.find("#totalCalories #rda")  .text(Math.round((calories*servings/journal.dailyValues.calories)*100) + "%");
            el.find("#fat #rda")            .text(Math.round((fat*servings/journal.dailyValues.fat)*100) + "%");
            el.find("#cholesterol #rda")    .text(Math.round((cholesterol*servings/journal.dailyValues.cholesterol)*100) + "%");
            el.find("#sodium #rda")         .text(Math.round((sodium*servings/journal.dailyValues.sodium)*100) + "%");
            el.find("#carbohydrates #rda")  .text(Math.round((carbohydrates*servings/journal.dailyValues.carbohydrates)*100) + "%");
            el.find("#dietryFibre #rda")    .text(Math.round((fibre*servings/journal.dailyValues.fibre)*100) + "%");
            el.find("#protein #rda")        .text(Math.round((protein*servings/journal.dailyValues.protein)*100) + "%");
            this.updateNutrition();
        },

        updateNutrition: function(){
            var el = $("#nutritionInfo .boxEntry");

            for(var i=0; i<el.length; i++){
                var thisEl = $(el[i]);
                var percent = thisEl.find("#rda").text() || "0%";
                thisEl.find("#name").css("background-size", percent +" 100%");
            }

        },

        multiplyServing: function(serving, model){
            var att = model.attributes;
            var calories      = parseFloat(att.calories) || 0;
            var fat           = parseFloat(att.total_fat) || 0;
            var cholesterol   = parseFloat(att.cholesterol) || 0;
            var sodium        = parseFloat(att.sodium) || 0;
            var carbohydrates = parseFloat(att.total_carbohydrates) || 0;
            var fibre         = parseFloat(att.fiber) || 0;
            var protein       = parseFloat(att.protein) || 0;

            att.calories      = calories*serving;
            att.fat           = fat*serving;
            att.cholesterol   = cholesterol*serving;
            att.sodium        = sodium*serving;
            att.carbohydrates = carbohydrates*serving;
            att.fibre         = fibre*serving;
            att.protein       = protein*serving;

            model.attributes = att;
            return model;
        }

    });
});



