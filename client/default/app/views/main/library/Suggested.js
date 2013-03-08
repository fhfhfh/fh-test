/*--------------------
	app/views/main/library/Suggested

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Suggested.html',
        'views/components/AddFavorite'
], function($, _, Backbone, tpl, View) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'suggested',
	    events		: {
	    	'click #newMedia' : 'addFavorite',
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

		addFavorite: function(){
			var obj = {id:1, title: 'crosbie', type: 'video'};
			var view = new View(obj);
			$('body').append(view.render());
			view.show();
		}

	});
});
