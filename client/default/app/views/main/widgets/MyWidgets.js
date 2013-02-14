/*--------------------
	app/views/main/library/MyWidgets

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/MyWidgets.html',
], function($, _, Backbone, tpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'myWidgets',
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
