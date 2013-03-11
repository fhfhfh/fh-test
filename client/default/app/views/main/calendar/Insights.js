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
        insightOptions : function(){/*
 * Play with this code and it'll update in the panel opposite.
 *
 * Why not try some of the options above?
 */
Morris.Line({
  element: 'line-example',
  data: [
    { y: '2013-03-11', a: 1, b: 9 },
    { y: '2013-03-12', a: 7,  b: 6 },
    { y: '2013-03-13', a: 5,  b: 3 },
    { y: '2013-03-14', a: 2,  b: 5 },
    { y: '2013-03-15', a: 3,  b: 4 },
    { y: '2013-03-16', a: 7,  b: 6 },
    { y: '2013-03-17', a: 10, b: 9 },
  ],
  xkey: 'y',
  ykeys: ['a', 'b'],
  lineColors:['orange','lightblue'],
  lineWidth:'4px',
  pointSize:'8px',
  xLabels:'day'
//  labels: ['Series A', 'Series B']
});
 
            },
                
            renderIns: function(){
                
                    
            }

        });
    });
