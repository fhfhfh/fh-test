/*--------------------
	app/views/main/library/SuggestedWidgets

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/SuggestedWidgets.html',
        'text!templates/widgets/WidgetDetails.html'
], function($, _, Backbone, tpl, widgetDetailsTpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'suggestedWidgets',
	    events		: {
	    	'click .widget_panel' : 'showWidgetDetails',
	    	'click #quitBtn' : 'render'
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

		showWidgetDetails: function(e){
	        var target = e.currentTarget;
	        console.log('widget clicked', target);
	        var page = $(this.el);

	        var details = _.template(widgetDetailsTpl);
			var title = $(target).find('h1').text() || 'Untitled';
			// var info = $(target).attr('info');
			var imgSrc = $(target).find('img').attr('src');

			this.$el.html(details({
			   title: title,
			   description: "info",
			   src: imgSrc
			}));
		}

	});
});
