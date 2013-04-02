/*--------------------
	app/views/main/library/MyWidgets

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/MyWidgets.html',
        'views/WidgetScreen'
], function($, _, Backbone, tpl, WidgetView) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'myWidgets',
	    events		: {
	    	'click #showPage' : 'showPage'
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
			// Backbone.history.navigate('widgetScreen', true);

			var html = (new WidgetView()).render().el;
			$(html).hide();
			$('#content').append(html);

			$(html).slideDown();		
		}

	});
});
