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
                
                
                google.setOnLoadCallback(drawChart());
//                google.setOnLoadCallback(window.drawColumnChart1);
                function drawChart() {
                    var dataTable = new google.visualization.DataTable();
  dataTable.addColumn('string', 'Year');
  dataTable.addColumn('number', 'Energy');
  dataTable.addColumn({type: 'string', role: 'annotation'});
  dataTable.addColumn({type: 'string', role: 'annotationText', p: {html:true}});
  dataTable.addColumn('number', 'Mood');
//  dataTable.addColumn('number', 'UK');
  dataTable.addRows([
    ['Monday',  2, 'good',  '', 1],
    ['Tuesday', 5, 'bad',  '', 4],
    ['Wednesday', 8, '', '', 2],
    ['Thursday', 2, '',  '', 1],
    ['Friday', 3, '',  '', 4],
    ['Saturday', 8, '',  '', 2],
    ['Sunday', 10, '',  '', 8]
  ]);

  var options = {
                        title: 'Peachy',
                        lineWidth: 4,
                        'pointSize' : 10,
                         backgroundColor: 'none',
                         'vAxis.gridlines.color': '#FAAC58',
                         'animation.easing': 'linear',
                         'animation.duration' : 10,
                         colors:['#FAAC58','#0489B1'],
                         is3D: true
                    };
  var chart = new google.visualization.LineChart(document.getElementById('insight_graph'));
  chart.draw(dataTable, options);
                    $('#insight_graph').append('<img  src="img/calendar/IconPeachyTiny@2x.png"/>');
                }
                
//                Backbone.trigger('notify', 'No Information available');
       

            },
                
            renderIns: function(){
                
                    
            }

        });
    });
