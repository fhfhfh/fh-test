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
    var d1 = [];
    for (var i = 0; i < 14; i += 0.5)
        d1.push([i, Math.sin(i)]);

    var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

    // a null signifies separate line segments
    var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];
    
    $.plot($("#insight_graph"), [ d1, d2 ], {canvas: true});
//            Backbone.trigger('notify', 'No Information available');
            },
                
            renderIns: function(){
                
                    
            }

        });
    });
