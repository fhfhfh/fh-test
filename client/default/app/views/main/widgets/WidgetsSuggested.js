/*--------------------
	app/views/main/library/SuggestedWidgets

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/SuggestedWidgets.html',
], function($, _, Backbone, tpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'suggestedWidgets',
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
