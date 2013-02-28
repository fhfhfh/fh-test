/*--------------------
	app/views/main/calendar/month

--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'text!templates/components/Month.html',
    'text!templates/popups/DayEvents.html',
    ], function($, _, Backbone, tpl, dayEventTpl) {
        var evtArr = [];
        var target="";
        return Backbone.View.extend({
               
            // Backbone specific attributes
            tagName		: 'section',
            id			: 'month',
            events		: {
                'click .days td'	: 'eventsOn',
                'click #editEvents'	: 'editEvent',
                'click #month_btn'      : 'nextMonth',
                'click #preMonth_btn'      : 'previousMonth',
                'click #currentMonth_btn' :'currentMonth',
                'click #cancel_evt'    : 'editEvent',
                'click #ok_evt'     :'saveEvent'
            },
            template	: _.template(tpl),
            evt_day    :   "",
            
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
                    
                     if(evtArr.length>=0){
//                        alert(this.month+"     evtArr.month  "+evtArr[j].month)
                       for( var j=0; j <= evtArr.length; j++){
                    if(evtArr[j] && num == evtArr[j].day && this.month == evtArr[j].month && this.year == evtArr[j].year){
//                        alert("yes"+JSON.stringify(evtArr[j]+"  num "+num));
//                    alert("Here"+JSON.stringify($(days[i])));
                    $(days[i]).css({'background-color':'rgb(255, 246, 218)'});
                    $(days[i]).append(evtArr[j].img);
//                    j++;
                }}}
				
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
//                    alert("this.month+1 :- "+(this.month+1)+"  this.month  "+this.month)
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
                var evtArrLength = evtArr.length;
                var self = this;
                var month = this.monthName[self.month];
                target = e.currentTarget;
                var day = $(target).find('.day').html();
                var dateModel = '';// get Events model Item for the date that is clicked
                evt_day = day;
               
                var html = 	this.dayTpl({
                    date: month + ' ' + day + ', ' + self.year,
                    energy: dateModel.energy || 'n/a',
                    mood: dateModel.mood || 'n/a',
                    diet: dateModel.diet || 'n/a'
                });
                
                
                if(day != undefined){
                    $(target).append(html);
                    
                    if(evtArrLength >0)
                    {
                        for(var i=0;i<evtArrLength;i++)
                        {
                            if(evtArr[i].day == evt_day && evtArr[i].month == this.month && evtArr[i].year == this.year)
                                $("#attrList").append('<li class="energy"><span>'+evtArr[i].name+' - '+evtArr[i].details+'</span></li>');
                        }
                    }
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
                if(evt_day == '')
                    return;
                var self = this;
                var month = this.monthName[self.month];
                var target = e.currentTarget;
                var day = $(target).find('.day').html();
                console.log(e);
                var dateModel = '';// get Events model Item for the date that is clicked
                $('#evt_div h1').html("Add Event For "+evt_day+"  "+month+" "+this.year);
                var evt_div = $('#evt_div');
                if(evt_div.css("display")=="block") {
                    evt_div.hide();
                    $('#cover_div').hide();
                }
                else {
                    $('#cover_div').show();
                    evt_div.show();
                    $('#confirmPassword_txt').focus();
                }
            //                alert('Need information on what is needed here')
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
                     $(days[i]).css({'background-color':'white'});
                    if(days[i] && days[i].className == 'today'){
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
                    if(evtArr.length>=0){
                        
                       for( var j=0; j <= evtArr.length; j++){
                           if($(target).css('background-color')!= 'rgb(255, 246, 218)'){
                    if(evtArr[j] && num == evtArr[j].day && month == evtArr[j].month && this.year == evtArr[j].year){
                    
                    $(days[i]).css({'background-color':'rgb(255, 246, 218)'});
                    $(days[i]).append(evtArr[j].img);
//                    }
                }}}}
                    num = num +1;
                }
            },
            
            saveEvent : function(){
                var obj = {
                    name : $('#evt_name').val(),
                    details : $('#evt_details').val(),
                    day : evt_day,
                    month : this.month,
                    year : this.year,
                    img : "<img src='img/calendar/DaceHappyWhite@2x.png' style='margin-top: 12%;height : 50px'>"
                }
                if(obj.name !="" && obj.details !="")
                {
                    evtArr.push(obj);
                    var num=1;
                    var day = $(target).find('.day').html();
                    var days = this.$('.days td');
                    if($(target).css('background-color')!= 'rgb(255, 246, 218)')
                    for(var i=1; i<42 + 1 ; i++){
                        if(num == obj.day ){
                            $(target).append(obj.img);
                            $(target).css({align : 'center'});
                            $(target).css({'background-color':'rgb(255, 246, 218)'});
                            alert($(target).css('background-color'));
                        } 
                        num++;
                    }
                }
                $('#evt_name').val("");
                $('#evt_details').val("");
                $('#evt_div').hide();
                $('#cover_div').hide();
                
                
            }
        });
    });
