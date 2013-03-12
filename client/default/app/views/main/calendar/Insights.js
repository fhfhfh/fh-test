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
var chartdata3 = {

  "config": {
    "title": "bezierLine Chart",
    "subTitle": "Canvasを使ったベジェなラインチャートです",
    "type": "bezi",
    "lineWidth": 12,
    "colorSet": 
          ["red","#FF9114","#3CB000","#00A8A2","#0036C0","#C328FF","#FF34C0"],
    "bgGradient": {
            "direction":"vertical",
            "from":"#687478",
            "to":"#222222"
          }
  },

  "data": [
    ["年度",2007,2008,2009,2010,2011,2012,2013],
    ["紅茶",435,332,524,688,774,825,999],
    ["コーヒー",600,335,584,333,457,788,900],
    ["ジュース",60,435,456,352,567,678,1260],
    ["ウーロン",200,123,312,200,402,300,512]
  ]
};
ccchart.init('hoge', chartdata3)  
            },
                
            renderIns: function(){
                
                    
            }

        });
    });
