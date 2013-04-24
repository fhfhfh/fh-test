/*--------------------
	app/views/main/library/WidgetStore

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/WidgetStore.html',
        'text!templates/widgets/Widget1Details.html',
 
], function($, _, Backbone, tpl, widgetDetailsTpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'widgetStore',
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
	       // var info = $(target).attr('info');

	        this.$el.html(details({
	           // title: target.innerHTML,
	           // info: info
	        }));
		}

	});
});
