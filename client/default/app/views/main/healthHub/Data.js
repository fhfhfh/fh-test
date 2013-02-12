/*--------------------
	app/views/main/healthHub/Hub

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Data.html',
        'text!templates/popups/FilterView.html',
], function($, _, Backbone, tpl, filterTpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'data',
	    events		: {
	    	'click #viewBtn' : 'showFilter',
	    	'click label' : 'changeView'
	    },
	    template	: _.template(tpl),
	    filterTpl 	: _.template(filterTpl),


		initialize : function(){
			_.bindAll(this);
		},

		render: function(){
			var self = this;

			this.$el.html(this.template());
			return this;
		},

		showFilter: function(){
			var self = this;
			var body = "<input type='checkbox' checked name='measure' value='true' id='measure'/><label data-id='measurements' for='measure'>Measurements <img src='img/Search.png'/></label><input type='checkbox' checked name='results' value='true' id='results'/><label data-id='testResults' for='results'>Test Results<img src='img/Search.png'/></label><input type='checkbox' checked name='immune' value='true' id='immune'/><label data-id='immunizations' for='immune'>Immunizations<img src='img/Search.png'/></label>";
			
			// close existing popup
			if($('div #filterView').length > 0){
				$('div #filterView').toggle();
				return;
			}
			else {
				$('#data').append(self.filterTpl({body: body}));	
			}
			
		},

		changeView: function(e){
			var target	= e.currentTarget;
			var div		= $(target).attr('data-id');

			$('#' +div).toggle();
			this.container.refreshScroll();

		}

	});
});
