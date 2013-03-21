/*--------------------
	app/views/main/library/WidgetLibrary

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/WidgetLibrary.html',
], function($, _, Backbone, tpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'widgetLibrary',
	    events		: {
	    	'click #showPage'	: 'showPage',
	    	'click #item'		: 'showPage'
	    },
	    template	: _.template(tpl),


		initialize : function(){
			_.bindAll(this);
		},

		render: function(){
			var self = this;

			this.$el.html(this.template());

			return this;
		},

		showPage: function(){
			Backbone.history.navigate('widgetScreen', true);			
		}

	});
});
