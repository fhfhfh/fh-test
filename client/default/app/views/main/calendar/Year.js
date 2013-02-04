/*--------------------
	app/views/main/calendar/month

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Month.html',
], function($, _, Backbone, tpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'month',
	    events		: {
	    },
	    template	: _.template(tpl),


		initialize : function(){
			_.bindAll(this);
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
