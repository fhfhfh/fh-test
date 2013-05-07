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
	    	'click .showPage' : 'showPage'
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

// edited to be consistent with rest of app
		showPage: function(e){
			var target = $(e.currentTarget);
			var id = target[0].id;
			if(id==='blankNav'){
				Backbone.trigger('notify', 'Item Not Available, used as Placeholder only', 'Placeholder Item');
				return;
			}
			var html = (new WidgetView([initial=id])).render().el;
			$(html).hide();
			$('#content').append(html);

			$(html).slideDown(1000);		
		}

	});
});
