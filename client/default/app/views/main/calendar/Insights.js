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
    
    $.plot($("#insight_graph"), [ d1, d2, d3 ], {canvas: true});
    
    
    
    
    
            
//                    var
//    d1 = [[0, 3], [4, 8], [8, 5], [9, 13]], // First data series
//    d2 = [],                                // Second data series
//    i, graph;
//
//  // Generate first data set
//  for (i = 0; i < 14; i += 0.5) {
//    d2.push([i, Math.sin(i)]);
//  }
//
//  // Draw Graph
//  graph = Flotr.draw(insight_graph, [ d1, d2 ], {
//    xaxis: {
//      minorTickFreq: 4
//    }, 
//    grid: {
//      minorVerticalLines: true
//    }
//  });
//            
            
            
            
            
            
            
            
//            
//            
//                var r = Raphael("insight_graph"),
//                    txtattr = { font: "12px 'Fontin Sans', Fontin-Sans, sans-serif" };
//                
//                var x = [], y = [], y2 = [], y3 = [];
//
//                for (var i = 0; i < 1e6; i++) {
//                    x[i] = i * 10;
//                    y[i] = (y[i - 1] || 0) + (Math.random() * 7) - 3;
//                    y2[i] = (y2[i - 1] || 150) + (Math.random() * 7) - 3.5;
//                    y3[i] = (y3[i - 1] || 300) + (Math.random() * 7) - 4;
//                }
//
//                r.text(160, 10, "Simple Line Chart (1000 points)").attr(txtattr);
//                r.text(480, 10, "shade = true (10,000 points)").attr(txtattr);;
//                r.text(160, 250, "shade = true & nostroke = true (1,000,000 points)").attr(txtattr);
//                r.text(480, 250, "Symbols, axis and hover effect").attr(txtattr);
//
//                r.linechart(10, 10, 300, 220, x, [y.slice(0, 1e3), y2.slice(0, 1e3), y3.slice(0, 1e3)]).hoverColumn(function () {
//                    this.set = r.set(
//                        r.circle(this.x, this.y[0]),
//                        r.circle(this.x, this.y[1]),
//                        r.circle(this.x, this.y[2])
//                    );
//                }, function () {
//                    this.set.remove();
//                });
//
//                r.linechart(330, 10, 300, 220, x, [y.slice(0, 1e4), y2.slice(0, 1e4), y3.slice(0, 1e4)], { shade: true });
//                r.linechart(10, 250, 300, 220, x, [y, y2, y3], { nostroke: true, shade: true });
//
//                var lines = r.linechart(330, 250, 300, 220, [[1, 2, 3, 4, 5, 6, 7],[3.5, 4.5, 5.5, 6.5, 7, 8]], [[12, 32, 23, 15, 17, 27, 22], [10, 20, 30, 25, 15, 28]], { nostroke: false, axis: "0 0 1 1", symbol: "circle", smooth: true }).hoverColumn(function () {
//                    this.tags = r.set();
//
//                    for (var i = 0, ii = this.y.length; i < ii; i++) {
//                        this.tags.push(r.tag(this.x, this.y[i], this.values[i], 160, 10).insertBefore(this).attr([{ fill: "#fff" }, { fill: this.symbols[i].attr("fill") }]));
//                    }
//                }, function () {
//                    this.tags && this.tags.remove();
//                });
//
//                lines.symbols.attr({ r: 6 });
//                // lines.lines[0].animate({"stroke-width": 6}, 1000);
//                // lines.symbols[0].attr({stroke: "#fff"});
//                // lines.symbols[0][1].animate({fill: "#f00"}, 1000);
//            Backbone.trigger('notify', 'No Information available');
            },
                
            renderIns: function(){
                
                    
            }

        });
    });
