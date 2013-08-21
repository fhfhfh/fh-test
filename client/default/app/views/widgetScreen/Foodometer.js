/**
 * @fileOverview The Foodometer Widget
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/Foodometer.html',
    'text!templates/popups/MonthPicker.html',
    'text!templates/widgets/FoodItem.html',
    'models/Calendar',
    'collections/FoodJournal',
    'models/Acts'
], function($, _, Backbone, tpl, monthPicker, foodItem, calendar, collection, Act) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'foodometer',
        template: _.template(tpl),
        monthTpl: _.template(monthPicker),
        foodItemTpl: _.template(foodItem),
        events: {
            'click #monthPick': 'showMonthPicker',
            'click td': 'selectDay',
            'click #back': 'prevMonth',
            'click #forward': 'nextMonth',
            'click .meal': 'showMealScreen',
            'click #share': 'shareFunction',
            'click #add': 'showAddPopup',
            'click #addFood': 'addFoodItem',
            'click #copyFood': 'copyFoodItem',
            'click #clearFood': 'clearMeal',
            'click #nutrition': 'showNutrition',
            'click #foodList .boxEntry': 'showFoodItem',
            'click #cancelFood': 'closeFoodItem',
            'click #editItem': 'editFoodItem',
            'click #deleteItem': 'deleteFoodItem'
        },
        number: 5,

        initialize: function() {
            var date = new Date();
            this.date = date;
            this.month = date.getMonth();
            this.day = date.getDay();
            this.year = date.getFullYear();
            this.calendar = new calendar();
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());
            this.renderCal();
            this.renderDay();
            return this;
        },

        renderCal: function(date) {
            date = date || new Date();
            date.setMonth(this.month);
            date.setFullYear(this.year);
            var todaysDate = new Date();
            var self = this;
            var days = this.$('.days td');
            var first = this.calendar.getFirstDay(date);
            var today = new Date().getDate();
            var cls = '';
            var monthLength = this.calendar.daysInMonth(self.month, self.year);
            var num = 1;
            $(days).html('');
            $(days).removeClass('today');

            for (var i = first; i < monthLength + first; i++) {
                var model = null;
                var dateNumber = new Date(date.setDate(num));
                if (num == today && this.month == todaysDate.getMonth() && this.year == todaysDate.getFullYear()) {
                    cls = 'today';
                } else {
                    cls = '';
                }
                model = collection.find(function(item) {
                    return item.get('date').toDateString() == dateNumber.toDateString();
                });

                if (model !== null && model !== undefined && !model.isEmpty()) {
                    $(days[i]).css("background-image", "url('../img/calendar/FaceHappy.png')");
                    $(days[i]).css("background-position", "10px 10px");
                    $(days[i]).css("background-repeat", "no-repeat no-repeat");
                }
                $(days[i]).html("<div class='day'>" + num + "</div>");
                $(days[i]).addClass(cls);
                num = num + 1;
            }

            var dayStr = this.calendar.getDayStr(self.day);
            var monthStr = this.calendar.getMonthStr(self.month);
            this.$("#dateString").html(dayStr + ', ' + monthStr + " " + today + ", " + this.year);
        },

        showMonthPicker: function() {
            var self = this;
            // close existing popup
            if ($('div #filterView').length > 0) {
                $('div #filterView').toggle();
                return;
            } else {
                $('#foodometer').append(self.monthTpl());
                $("#month").html(this.calendar.monthName[this.month] + ", " + this.year);
                $('#back').unbind().bind('click', function() {
                    self.prevMonth();
                });
                $('#forward').unbind().bind('click', function() {
                    self.nextMonth();
                });
            }
        },

        selectDay: function(e) {
            var target = e.currentTarget || e;
            this.CURRENTDAY = $(target);
            var month = this.month;
            var day = $(target).text();
            var year = this.year;
            var date = new Date(year, month, day);
            var dayNum = date.getDay();
            var dayStr = this.calendar.getDayStr(dayNum);
            var monthStr = this.calendar.getMonthStr(this.month);
            var currentDate;

            console.log(target);

            // close month picker if its open
            if ($('div #filterView').length > 0) {
                $('div #filterView').hide();
            }

            // remove selected class from any meals
            this.$('.meal').removeClass('selected');
            $("#nutritionSection").hide();
            $('#foodItemScreen').remove();

            $("#dateString").html(dayStr + ', ' + monthStr + " " + day + ", " + this.year);
            $('.today').removeClass('today');
            $(target).addClass('today');

            console.log("Selected date ", date);
            currentDate = date;

            if (currentDate === date) {
                console.log("Active date");
                this.renderDay(currentDate);
            } else {
                console.log("new date");
                this.renderDay(date);
            }
            return currentDate;
        },

        prevMonth: function() {
            var date = new Date();
            if (this.month <= 0) {
                this.month = 12;
                this.year = this.year - 1;
            }
            this.month = this.month - 1;
            $("#month").html(this.calendar.monthName[this.month] + ", " + this.year);
            this.renderCal();
        },

        nextMonth: function() {
            var date = new Date();
            if (this.month >= 11) {
                this.month = -1;
                this.year = this.year + 1;
            }
            this.month = this.month + 1;
            $("#month").html(this.calendar.monthName[this.month] + ", " + this.year);
            this.renderCal();
        },

        renderDay: function(date) {
            console.log("renderDay", date);
            var self = this;
            date = date || new Date();
            var dayModel = collection.find(function(item) {
                // console.log("*** current date", date.toDateString());
                return item.get('date').toDateString() == date.toDateString();
            });

            self.item = null;

            if (dayModel) { // check if model exists for selected date
                self.item = dayModel; // make model globally accessible 
                console.log(self.item.attributes);
                if (self.item.isEmpty()) { // check if model has any food entries
                    self.showEmptyScreen();
                } else {
                    self.showMealScreen(self.date);
                }
            } else {
                self.item = collection.createDay(date);
                self.showEmptyScreen(); // if no model exists for date, assume empty
            }
        },

        showMealScreen: function(e, date) {
            var target = (e) ? e.currentTarget : '.meal[data-name="breakfast"]';
            var meal = this.$(target).attr('data-name') || 'breakfast';
            this.meal = meal;
            // change item class to selected
            this.$('.meal').removeClass('selected');
            this.$(target).addClass('selected');

            var dateString = this.$('#dateString').text() || date;
            console.log(dateString, date);
            var mealString = 'My ' + meal.substring(0, 1).toUpperCase() + meal.substring(1, meal.length);

            this.$('#mealContainer').show();
            this.$('#emptyFood').hide();
            this.$('#foodItemScreen').remove();

            this.$('#mealString').text(mealString);
            this.$('#foodList .boxHeader span').text(dateString);
            this.populateMeal(meal);
        },

        showEmptyScreen: function() {
            this.$('#mealContainer').hide();
            this.$('#emptyFood').show();
        },

        saveFoodsToJournal: function(currentDate) {
            var self = this;
            var foodArr = this.container.foodItems;
            if (foodArr.length > 0) {
                var meal = self.meal;
                for (var i = 0; i < foodArr.length; i++) {
                    var arr = self.item.attributes[meal];
                    arr.push(foodArr[i].attributes);
                    self.item.set(meal, arr);
                    self.item.recalculateNutrients();
                }
                this.container.foodItems = [];
            }

            console.log(self.item);
            var a = new Date(self.item.attributes.date);
            console.log(a);
            setTimeout(function() {
                // render current day journal
                var currentDay = self.CURRENTDAY;
                console.log(currentDay);
                self.selectDay(currentDay);
                self.renderDay(a);
            }, 10);
        },

        populateMeal: function(meal) {
            this.$('#foodList .boxEntry').remove();
            var item = this.item;
            var self = this;

            if (item && meal) {
                var foods = item.attributes[meal];
                if (foods.length === 0) {
                    this.$('#calCount').text("");
                    this.$('#location').val("");
                    this.$('#with').val("");
                    this.$('#time').val("");
                    this.$('#notes').val("");
                    this.$('#goalNum').text("");
                    this.$('#currentNum').text("");
                    this.$('#remainingNum').text("");
                    return;
                }
                // loop starts at 1 as first entry is meal details (calories, notes, etc.)
                for (var i = 1; i < foods.length; i++) {
                    var index = foods[i];
                    var html = '<div class="boxEntry" data-id="' + index.id + '">' +
                        '<span id="name">' + index.name + '</span>' +
                        '<span id="about">' + index.serving + '</span>' +
                        '</div>';
                    this.$('#foodList').append(html);
                }

                // populate meal info
                var foodInfo = foods[0];

                this.$('#calCount').text(foodInfo.calories + ' Calories');
                this.$('#location').val(foodInfo.location);
                this.$('#with').val(foodInfo.with);
                this.$('#time').val(foodInfo.time);
                this.$('#notes').val(foodInfo.notes);

                // populate calorie counter
                var att = item.attributes;
                this.$('#goalNum').text(att.goalCals + ' Calories');
                this.$('#currentNum').text(att.currentCals + ' Calories');
                this.$('#remainingNum').text(att.remainingCals + ' Calories');
            } else {
                this.$('#calCount').text("");
                this.$('#location').val("");
                this.$('#with').val("");
                this.$('#time').val("");
                this.$('#notes').val("");
                this.$('#goalNum').text("");
                this.$('#currentNum').text("");
                this.$('#remainingNum').text("");
            }
            this.container.refreshScroll();
        },

        shareFunction: function() {
            console.log('share function...');
            console.log(this.item);
            collection.saveToCloud(this.item);

        },

        showAddPopup: function() {
            Act.call('createDBAction', {},
                function(res) {
                    // alert('Saved successfully' + JSON.stringify(res));
                }, function(err, msg) {
                    console.log(JSON.stringify(msg));
                });

            $('#add').toggleClass('selected');
            $('#addFoodPopup').toggle();
        },

        addFoodItem: function() {
            this.meal = $(".meal.selected").attr('data-name') || "breakfast";
            console.log(this.meal);
            this.container.setActiveView('foodScreen');
        },

        copyFoodItem: function() {
            var date = new Date();
            var d2 = new Date();
            var meal = $(".meal.selected").attr('data-name') || "breakfast";

            date.setDate(date.getDate() - 1);

            var yesterdayModel = collection.find(function(item) {
                return item.get('date').toDateString() == date.toDateString();
            });
            var todayModel = collection.find(function(item) {
                return item.get('date').toDateString() == d2.toDateString();
            });

            if (!todayModel) {
                yesterdayModel.attributes.date = new Date();
                collection.createDay(date, yesterdayModel);
            } else {
                todayModel.set(meal, yesterdayModel.attributes[meal]);
            }

            this.populateMeal(meal);
            $('#add').toggleClass('selected');
            $('#addFoodPopup').toggle();
        },

        clearMeal: function() {
            //TODO: clear todays meal
            var meal = $(".meal.selected").attr('data-name') || "breakfast";
            this.item.clearMeal(meal);
            $('#add').toggleClass('selected');
            $('#addFoodPopup').toggle();
            this.populateMeal(meal);
        },

        showNutrition: function() {
            var self = this;
            if ($('#nutritionSection').is(':visible')) {
                $("#nutritionSection").hide();
                $("#mealInputs").show();
            } else {
                $("#nutritionSection").show();
                $("#mealInputs").hide();
                self.populateNutrition(self.item, self.meal, $("#nutritionSection"), 0);
            }
        },

        updateNutrition: function(el) {
            el = el || $("#nutritionSection .boxEntry");

            for (var i = 0; i < el.length; i++) {
                var thisEl = $(el[i]);
                var percent = thisEl.find("#rda").text() || "0%";
                thisEl.find("#name").css("background-size", percent + " 100%");
            }

        },

        populateNutrition: function(model, meal, el, index) {
            model = model.attributes;
            el = el || $("#nutritionSection");
            index = index || 0;
            meal = model[meal][index];

            el.find("#totalCalories #amount").text(Math.round(meal.calories));
            el.find("#fat #amount").text(Math.round(meal.fat));
            el.find("#cholesterol #amount").text(Math.round(meal.cholesterol));
            el.find("#sodium #amount").text(Math.round(meal.sodium));
            el.find("#carbohydrates #amount").text(Math.round(meal.carbohydrates));
            el.find("#dietryFibre #amount").text(Math.round(meal.fibre));
            el.find("#protein #amount").text(Math.round(meal.protein));

            //rda's
            el.find("#totalCalories #rda").text(Math.round((meal.calories / collection.dailyValues.calories) * 100) + "%");
            el.find("#fat #rda").text(Math.round((meal.fat / collection.dailyValues.fat) * 100) + "%");
            el.find("#cholesterol #rda").text(Math.round((meal.cholesterol / collection.dailyValues.cholesterol) * 100) + "%");
            el.find("#sodium #rda").text(Math.round((meal.sodium / collection.dailyValues.sodium) * 100) + "%");
            el.find("#carbohydrates #rda").text(Math.round((meal.carbohydrates / collection.dailyValues.carbohydrates) * 100) + "%");
            el.find("#dietryFibre #rda").text(Math.round((meal.fibre / collection.dailyValues.fibre) * 100) + "%");
            el.find("#protein #rda").text(Math.round((meal.protein / collection.dailyValues.protein) * 100) + "%");
            this.updateNutrition();
        },

        showFoodItem: function(e) {
            var target = $(e.currentTarget);
            var id = target.attr("data-id");
            var item = this.item;
            var meal = $(".meal.selected").attr('data-name') || "breakfast";
            var self = this;
            if (item) {
                var foods = item.attributes[meal];

                // loop starts at 1 as first entry is meal details (calories, notes, etc.)
                for (var i = 1; i < foods.length; i++) {
                    var index = foods[i];
                    if (index.id === id) {
                        var servings = index.serving.split(" x ")[0];
                        var size = index.serving.split(" x ")[1];

                        this.foodItem = foods[i];
                        this.$('#mealContainer').hide();
                        this.$('#nutritionSection').hide();
                        this.$("#rightContent").append(self.foodItemTpl({
                            item: index,
                            imgSrc: ""
                        }));
                        $("#size").val(size).attr('disabled', 'disabled');
                        $("#serving").val(parseInt(servings, 10));
                        self.populateNutrition(item, meal, $('#nutritionInfo'), i);
                        $("#foodItemScreen").attr("data-id", id);
                    }
                }
            }
            this.updateNutrition($('#nutritionInfo .boxEntry'));
        },

        closeFoodItem: function() {
            console.log('******** closed');
            this.$('#mealContainer').show();
            this.$('#foodItemScreen').remove();
        },

        editFoodItem: function() {
            var self = this;
            var meal = $(".meal.selected").attr('data-name') || "breakfast";
            var mealArr = this.item.attributes[meal];
            var newServing = parseInt($("#serving").val(), 10);
            var oldServing = parseInt(self.foodItem.serving.split(" x ")[0], 10);
            var size = self.foodItem.serving.split(" x ")[1];

            for (var i = 1; i < mealArr.length; i++) {
                if (mealArr[i].id == self.foodItem.id) {
                    var item = mealArr[i];
                    item.serving = newServing + " x " + size;
                    item = self.multiplyNutrition(newServing, item, oldServing);
                    self.item.set(meal, mealArr);
                    self.$('#mealContainer').show();
                    self.$('#foodItemScreen').remove();
                    self.populateMeal(meal);
                }
            }
        },

        multiplyNutrition: function(serving, model, oldServing) {
            var att = model;
            var calories = parseFloat(att.calories) || 0;
            var fat = parseFloat(att.total_fat) || 0;
            var cholesterol = parseFloat(att.cholesterol) || 0;
            var sodium = parseFloat(att.sodium) || 0;
            var carbohydrates = parseFloat(att.total_carbohydrates) || 0;
            var fibre = parseFloat(att.fiber) || 0;
            var protein = parseFloat(att.protein) || 0;

            att.calories = (calories / oldServing) * serving;
            att.fat = (fat / oldServing) * serving;
            att.cholesterol = (cholesterol / oldServing) * serving;
            att.sodium = (sodium / oldServing) * serving;
            att.carbohydrates = (carbohydrates / oldServing) * serving;
            att.fibre = (fibre / oldServing) * serving;
            att.protein = (protein / oldServing) * serving;

            model.attributes = att;
            return model;
        },

        deleteFoodItem: function() {
            console.log(this.foodItem);
            var self = this;
            var meal = $(".meal.selected").attr('data-name') || "breakfast";
            var mealArr = this.item.attributes[meal];

            for (var i = 1; i < mealArr.length; i++) {
                if (mealArr[i].id == self.foodItem.id) {
                    mealArr.splice(i, 1);
                    self.item.set(meal, mealArr);
                    self.$('#mealContainer').show();
                    self.$('#foodItemScreen').remove();
                    self.populateMeal(meal);
                }
            }
        }


    });
});