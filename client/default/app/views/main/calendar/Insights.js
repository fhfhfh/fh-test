/*--------------------
	app/views/main/calendar/month

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Insights.html'
], function($, _, Backbone, tpl) {

    return Backbone.View.extend({

        // Backbone specific attributes
        tagName: 'section',
        id: 'insights',
        events: {
            'click .insight_list ': 'eventsOn',
            'click #insight_options': 'insightOptions'
        },
        monthName: [
                'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December'
        ],
        monthDays: ['Sunday', 'Monday', 'Tuesday', 'wednesday', 'Thursday', 'Friday', 'Saturday'],
        template: _.template(tpl),


        initialize: function() {
            _.bindAll(this);
            var date = new Date();
            this.date = date;
            this.month = date.getMonth();
            this.year = date.getFullYear();
            this.day = date.getDate();
            this.dayWeek = this.monthDays[date.getUTCDay()];
            this.date = new Date().toString('dddd, MMMM ,yyyy');
            this.render();
        },

        render: function() {
            var self = this;

            this.$el.html(this.template({
                today: self.date
            }));
            var _this = this;
            //                this.renderIns();
            setTimeout(function() {
                _this.renderIns();
            }, 0);
            return this;
        },
        eventsOn: function() {
            //                  alert("No Information available");  
            Backbone.trigger('notify', 'No Information available');
        },
        insightOptions: function() {
            var self = this;
            $('#insight_graph').animate({
                height: 'toggle'
            }, 500, function() {
                // Animation complete.
                self.container.refreshScroll();
            });
        },

        renderIns: function() {

            // data for days 0=Monday....6=Sunday
            var d2 = [
                [0, 2],
                [1, 3],
                [2, 1],
                [3, 1],
                [4, 1],
                [5, 5],
                [6, 3]
            ];
            var d1 = [
                [0, 5],
                [1, 4],
                [2, 6],
                [3, 4],
                [4, 4],
                [5, 7],
                [6, 5]
            ];

            //Properties 
            var option = {
                grid: {
                    borderColor: "white",
                    hoverable: true,
                    mouseActiveRadius: 30 //specifies how far the mouse can activate an item 
                    //                        color:"white"
                },
                //                    border :"none",

                points: {
                    symbol: "circle",
                    fillColor: "white"
                },

                legend: {
                    labelBoxBorderColor: "none",
                    position: "right"
                },

                series: {
                    lines: {
                        show: true,
                        lineWidth: 4
                    },
                    points: {
                        radius: 6,
                        show: true,
                        fill: true
                    }
                },
                yaxis: {
                    show: false,
                    min: 0,
                    max: 10
                },

                xaxis: {
                    ticks: [
                        [0, "Monday"],
                        [1, "Tuesday"],
                        [2, "Wednesday"],
                        [3, "Thursday"],
                        [4, "Friday"],
                        [5, "Saturday"],
                        [6, "Sunday"]
                    ],
                    "lines": {
                        "show": "true"
                    },
                    "points": {
                        "show": "true"
                    },
                    clickable: true,
                    hoverable: true
                }
            };

            $.plot($("#insight_graph"), [d1, d2], option);
        }

    });
});