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
    'models/Calendar'
], function($, _, Backbone, tpl, monthPicker, mealTpl, calendar) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'foodometer',
        template: _.template(tpl),
        monthTpl: _.template(monthPicker),
        events: {
            'click #monthPick' : 'showMonthPicker',
            'click td' : 'showDay',
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

        showDay: function(e){
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
                $('div #filterView').toggle();
            }

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

        },

        showMealScreen: function(e){
            var target = e.currentTarget;
            var meal = $(target).attr('data-name');
            console.log(meal);
        }

    });
});