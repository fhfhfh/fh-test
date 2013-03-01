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
                this.day                = date.getDay();
                this.dayWeek            = this.monthDays[date.getUTCDay()];
			this.date = new Date().toString('dddd, MMMM ,yyyy');
		},

		render: function(){
			var self = this;

			this.$el.html(this.template({
				today: self.date
			}));
                        return this;
		}

	});
});
