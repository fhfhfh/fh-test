/*--------------------
	app/views/main/calendar/month

--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'text!templates/components/Month.html',
    'text!templates/popups/DayEvents.html',
    ], function($, _, Backbone, tpl, dayEventTpl) {

        return Backbone.View.extend({

            // Backbone specific attributes
            tagName		: 'section',
            id			: 'month',
            events		: {
                'click .days td'	: 'eventsOn',
                'click #editEvents'	: 'editEvent',
                'click #month_btn'      : 'nextMonth',
                'click #preMonth_btn'      : 'previousMonth',
                'click #currentMonth_btn' :'currentMonth'
            },
            template	: _.template(tpl),
            dayTpl 		: _.template(dayEventTpl),
            monthName: [
            'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'
            ],


            initialize : function(){
                var self = this;
                _.bindAll(this);
                var date		= new Date();
                this.date		= date;
                this.month		= date.getMonth();
                this.year		= date.getFullYear();
                this.dateStr	= date.toString('dddd, MMMM ,yyyy');
                this.firstDay	= this.getFirstDay(date);

                this.dateStr = this.dateStr.split(' ')[0] + ' ' + this.dateStr.split(' ')[1] +' '+ this.dateStr.split(' ')[2];

            },

            render: function(){
                var self = this;
                this.$el.html(this.template({
                    today: self.dateStr
                }));
                this.renderCal();

                return this;
            },

            daysInMonth: function(month,year) {
                var month = month +1;
                return new Date(year, month, 0).getDate();
            },

            getFirstDay: function(date){
                var month = date.getMonth();
                //                        alert(month);
                var year = date.getFullYear();

                var dateObj = new Date();

                dateObj.setFullYear(year);
                dateObj.setMonth(month);
                dateObj.setDate(1);
                var first = dateObj.getDay();

                return first;
            },

            renderCal: function(){
                var self = this;
                var days = this.$('.days td');
                var first = this.firstDay;
                //                        alert (first);
                var today = new Date().getDate();
                var cls = '';
                //                        alert(self.month);
                var monthLength = this.daysInMonth(self.month, self.year);

                var num = 1;
                for(var i=first; i<monthLength + first ; i++){
                    if(num == today){
                        cls = 'today';
                    }
                    else {
                        cls = '';
                    }

                    $(days[i]).html("<div class='day'>" + num + "</div>");
                    $(days[i]).addClass(cls);
				
                    num = num +1;
                }
            },
                
            nextMonth: function(){
                var date		= new Date();
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
            },
            
            previousMonth: function(){
                var date		= new Date();
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
            
            currentMonth : function(){
                var date		= new Date();
                this.year = date.getFullYear();
                this.month = date.getMonth();
                $("#monthName").html(this.monthName[this.month]+","+date.getFullYear());
                this.setMonth(this.month)
            },


            /* Show a pop-up to display information/events
		 * about a given day. These events will be read dynamically from
		 * an Events model/collection for each date.
		 */
            eventsOn: function(e){
                $('#popDate').remove();

                var self = this;
                var month = this.monthName[self.month];
                var target = e.currentTarget;
                var day = $(target).find('.day').html();

                var dateModel = '';// get Events model Item for the date that is clicked

                var html = 	this.dayTpl({
                    date: month + ' ' + day + ', ' + self.year,
                    energy: dateModel.energy || 'n/a',
                    mood: dateModel.mood || 'n/a',
                    diet: dateModel.diet || 'n/a'
                });

                if(day != undefined){
                    $(target).append(html);
                    $('#popDate').hide().slideDown(200);


                    // Close window after 3 seconds
                    setTimeout(function(){
                        $(target).find('#popDate').slideUp(200);
                    }, 4000);
                }
            },

            // Open pop-up for editing/adding/removing events
            // Need more information on what is required here
            editEvent: function(e){
                alert('Need information on what is needed here')
            },
            
            setMonth : function(month){
                this.month = month;//date.getMonth();
                var date		= new Date();
                var dateObj = new Date();
                dateObj.setFullYear(this.year);
                dateObj.setMonth(this.month);
                dateObj.setDate(1);
                var first = dateObj.getDay();
                var self = this;
                var days = this.$('.days td');
                var today = new Date().getDate();
                var cls = '';
                for(var i=0; i<= first ; i++){
                    $(days[i]).html("<div class='day'>  </div>");
                }
                var monthLength = this.daysInMonth(this.month, self.year);
                var num = 1;
                for(var i=first; i<42 + first ; i++){
                    
                    if(days[i].className == 'today'){
                        $(days[i]).removeClass('today')
                        $(days[i]).addClass(' ');
                    }
                    cls = '';
                     if(num == today && self.year == date.getFullYear() && this.month == date.getMonth()){
                        cls = 'today';
                    }
                    $(days[i]).html("<div class='day'>  </div>");
                    if(monthLength >= num){
                        $(days[i]).html("<div class='day'>" + num + "</div>");
                        $(days[i]).addClass(cls);
                    }
                    num = num +1;
                }
            }
        });
    });
