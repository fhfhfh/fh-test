/*--------------------
	app/views/main/calendar/month

--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'text!templates/components/Insights.html',
    ], function($, _, Backbone, tpl) {

        return Backbone.View.extend({

            // Backbone specific attributes
            tagName		: 'section',
            id			: 'insights',
            events		: {
                'click .insight_list '	: 'eventsOn',
                'click #insight_options' : 'insightOptions'
            },
            monthName: [
            'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'
            ],
            monthDays:['Sunday','Monday','Tuesday','wednesday','Thursday','Friday','Saturday'],
            template	: _.template(tpl),


            initialize : function(){
                _.bindAll(this);
                var date		= new Date();
                this.date		= date;
                this.month		= date.getMonth();
                this.year		= date.getFullYear();
                this.day                = date.getDate();
                this.dayWeek            = this.monthDays[date.getUTCDay()];
                this.date = new Date().toString('dddd, MMMM ,yyyy');
                this.render();
            },

            render: function(){
                var self = this;

                this.$el.html(this.template({
                    today: self.date
                }));
                this.renderIns();
                return this;
            },
            eventsOn: function(){
                //                  alert("No Information available");  
                Backbone.trigger('notify', 'No Information available');
            },
            insightOptions : function(){
        g = new Dygraph(

    // containing div
    document.getElementById("insight_graph"),

    // CSV or path to a CSV file.
    "Date,Temperature\n" +
    "2008-05-07,75\n" +
    "2008-05-08,70\n" +
    "2008-05-09,80\n"

  );    
            },
                
            renderIns: function(){
                
                    
            }

        });
    });
