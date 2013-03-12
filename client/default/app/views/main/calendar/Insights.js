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
//                alert("Here");
//                
//                // example 1 - two basic series
//$.plot(
// $("#insight_graph"),
// [
//   {
//     label: "Series 1",
//     data: [ [0, 0], [1, 1], [2, 1], [3, 2] ],
//     lines: {show: true},
//     points: {show: true}
//   },
//   {
//     label: "Series 2",
//     data: [ [0, 3], [1, 5], [2, 8], [3, 13] ],
//     lines: {show: true},
//     points: {show: true}   
//   }
// ]
//);
//                

 var chart1 = new Highcharts.Chart({
        chart: {
            renderTo: 'insight_graph',
            type: 'line'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });

                
                
                
//                var d1 = [];
//                for (var i = 0; i < 14; i += 0.5)
//                    d1.push([i, Math.sin(i)]);
//
//                var d2 = [[3,12], [8,"2010/11/05"], [5,"2010/11/07"], [13,"2010/11/01"]];
//
//                // a null signifies separate line segments
//                var d3 = [[0, 12], [7, 12], [7, 2.5], [12, 2.5]];
//    
//                $.plot($("#insight_graph"), [ d1, d2, d3 ], {
//                    canvas: false
//                 
//                });
//                        Backbone.trigger('notify', 'No Information available');
            },
                
            renderIns: function(){
                
                    
            }

        });
    });
