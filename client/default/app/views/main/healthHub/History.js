/*--------------------
	app/views/main/healthHub/History

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/History.html',
], function($, _, Backbone, tpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'history',
	    events		: {
	    },
	    template	: _.template(tpl),


		initialize : function(){
			_.bindAll(this);
		},

		render: function(){
			var self = this;

			this.$el.html(this.template());
			return this;
		}

	});
});
