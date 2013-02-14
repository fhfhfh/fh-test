/*--------------------
	app/views/main/library/Suggested

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Suggested.html',
], function($, _, Backbone, tpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'suggested',
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
