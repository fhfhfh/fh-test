/*--------------------
	app/views/main/healthHub/History

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/History.html',
        'text!templates/popups/FilterView.html',
], function($, _, Backbone, tpl, filterTpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'history',
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
			var body = "<input type='checkbox' checked name='family' value='true' id='family'/><label data-id='familyHistory' for='family'>Family History <img src='img/Search.png'/></label><input type='checkbox' checked name='social' value='true' id='social'/><label data-id='socialHistory' for='social'>Social History<img src='img/Search.png'/></label>";
			
			// close existing popup
			if($('div #filterView').length > 0){
				$('div #filterView').toggle();
				return;
			}
			else {
				$('#history').append(self.filterTpl({body: body}));	
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
