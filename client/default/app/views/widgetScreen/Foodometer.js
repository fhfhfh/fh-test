/**
 * @fileOverview The Foodometer Widget
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/Foodometer.html',
    'text!templates/popups/MonthPicker.html',
    'models/Calendar'
], function($, _, Backbone, tpl, monthPicker, calendar) {
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
            'click #picker' : 'prevMonth'
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

        renderCal: function(){
            var date        = new Date();
            var self        = this;
            var days        = this.$('.days td');
            var first       = this.calendar.getFirstDay(date);
            var today       = new Date().getDate();
            var cls         = '';
            var monthLength = this.calendar.daysInMonth(self.month, self.year);
            var num         = 1;
            for(var i=first; i<monthLength + first ; i++){
                if(num == today && this.month == date.getMonth() && this.year == date.getFullYear()){
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
            }
        },

        showDay: function(e){
            var target = e.currentTarget;
            console.log(target);
        },

        prevMonth: function(){
            console.log('previous');
            var date        = new Date();
            if(this.month<=0 )
            {
                this.month = 12;
                this.year = this.year-1;
            }
            if(this.month == date.month && this.year == date.getFullYear()){
                this.renderCal();
                return
            }
            $("#monthName").html(this.monthName[this.month-1]+","+this.year);
            this.setMonth(this.month-1);
        },

        nextMonth: function(){
            console.log('next');
            var date = new Date();
            if(this.month>=11 )
            {
                this.month = -1;
                this.year = this.year+1;
            }
            if(this.month+1 == date.getMonth() && this.year == date.getFullYear())
                this.currentMonth();
            else{
                $("#monthName").html(this.monthName[this.month+1]+","+this.year);
                var tempMonth = this.month;
                this.setMonth(this.month+1);
            }
        }
    });
});