/**
 * @fileOverview The Foodometer Widget
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/Foodometer.html',
    'text!templates/popups/MonthPicker.html',
    'text!templates/popups/MonthPicker.html',
    'models/Calendar',
    'collections/FoodJournal'
], function($, _, Backbone, tpl, monthPicker, mealTpl, calendar, collection) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'foodometer',
        template: _.template(tpl),
        monthTpl: _.template(monthPicker),
        events: {
            'click #monthPick' : 'showMonthPicker',
            'click td' : 'selectDay',
            'click #back' : 'prevMonth',
            'click #forward' : 'nextMonth',
            'click .meal'   : 'showMealScreen'
        },

        initialize: function() {
            var date      = new Date();
            this.date     = date;
            this.month    = date.getMonth();
            this.day      = date.getDay();
            this.year     = date.getFullYear();
            this.calendar = new calendar();
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());
            this.renderCal();
            this.renderDay();
            return this;
        },

        renderCal: function(date){
            var date        = date || new Date();
            date.setMonth(this.month);
            date.setFullYear(this.year);
            var todaysDate  = new Date();
            var self        = this;
            var days        = this.$('.days td');
            var first       = this.calendar.getFirstDay(date);
            var today       = new Date().getDate();
            var cls         = '';
            var monthLength = this.calendar.daysInMonth(self.month, self.year);
            var num         = 1;
            $(days).html('');
            $(days).removeClass('today');

            for(var i=first; i<monthLength + first ; i++){
                if(num == today && this.month == todaysDate.getMonth() && this.year == todaysDate.getFullYear()){
                    cls = 'today';
                }
                else {
                    cls = '';
                }
                $(days[i]).html("<div class='day'>" + num + "</div>");
                $(days[i]).addClass(cls);
                num = num +1;
            }

            var dayStr = this.calendar.getDayStr(self.day);
            var monthStr = this.calendar.getMonthStr(self.month);
            this.$("#dateString").html( dayStr +', '+monthStr+ " " + today + ", "+this.year);
        },

        showMonthPicker: function(){
            var self = this;
            // close existing popup
            if($('div #filterView').length > 0){
                $('div #filterView').toggle();
                return;
            }
            else {
                $('#foodometer').append(self.monthTpl());
                $("#month").html(this.calendar.monthName[this.month]+", "+this.year); 
                $('#back').unbind().bind('click', function(){
                    self.prevMonth();
                });
                $('#forward').unbind().bind('click', function(){
                    self.nextMonth();
                });
            }
        },

        selectDay: function(e){
            var target = e.currentTarget;
            var month  = this.month;
            var day    = $(target).text();
            var year   = this.year;
            var date   = new Date(year, month, day);
            var dayNum = date.getDay();
            var dayStr = this.calendar.getDayStr(dayNum);
            var monthStr = this.calendar.getMonthStr(this.month);

            // close month picker if its open
            if($('div #filterView').length > 0){
                $('div #filterView').hide();
            }
            // remove selected class from any meals
            this.$('.meal').removeClass('selected');

            $("#dateString").html( dayStr +', '+monthStr+ " " + day + ", "+this.year);
            $('.days td').removeClass('selected');
            $(target).addClass('selected');

            this.renderDay(date);
        },

        prevMonth: function(){
            var date        = new Date();
            if(this.month<=0 )
            {
                this.month = 12;
                this.year = this.year-1;
            }
            this.month = this.month-1;
            $("#month").html(this.calendar.monthName[this.month]+", "+this.year);
            this.renderCal();
        },

        nextMonth: function(){
            var date = new Date();
            if(this.month>=11 )
            {
                this.month = -1;
                this.year = this.year+1;
            }
            this.month = this.month+1;
            $("#month").html(this.calendar.monthName[this.month]+", "+this.year);
            this.renderCal();
        },

        renderDay: function(date){
            var self = this;
            var date = date || new Date();
            var dayModel = collection.find(function(item){
                return item.get('date').toDateString() == date.toDateString();
            });

            if(dayModel){ // check if model exists for selected date
                self.item = dayModel; // make model globally accessible 
                if(self.item.isEmpty()){ // check if model has any food entries
                    self.showEmptyScreen();
                } else {
                    self.showMealScreen();    
                }
            }
            else {
                self.item = null;
                self.showEmptyScreen(); // if no model exists for date, assume empty
            }
        },

        showMealScreen: function(e){
            var target = (e) ? e.currentTarget : '.meal';
            var meal = this.$(target).attr('data-name') || 'breakfast';
            // change item class to selected
            this.$('.meal').removeClass('selected');
            this.$(target).addClass('selected');

            var dateString = this.$('#dateString').text();
            var mealString = 'My ' + meal.substring(0,1).toUpperCase() + meal.substring(1,meal.length); 
    
            this.$('#mealContainer').show();
            this.$('#emptyFood').hide();

            this.$('#mealString').text(mealString);
            this.$('.boxHeader span').text(dateString);
            this.populateMeal(meal);
        },

        showEmptyScreen: function(){
            this.$('#mealContainer').hide();
            this.$('#emptyFood').show();
        },

        populateMeal: function(meal){
            this.$('#foodList .boxEntry').remove();
            var item = this.item;
            var self = this;
            console.log(item);
            if(item){
                var foods = item.attributes[meal];
                if(foods.length == 0){
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
                for(var i=1;i<foods.length;i++){
                    var index = foods[i];
                    var html = '<div class="boxEntry">'+
                        '<span id="name">'+ index.name+'</span>'+
                        '<span id="about">'+index.about+'</span>'+
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
            }
            else {
                this.$('#calCount').text("");
                this.$('#location').val("");
                this.$('#with').val("");
                this.$('#time').val("");
                this.$('#notes').val("");
                this.$('#goalNum').text("");
                this.$('#currentNum').text("");
                this.$('#remainingNum').text("");
            }

        }

    });
});