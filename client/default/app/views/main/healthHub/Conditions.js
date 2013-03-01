/*--------------------
	app/views/main/healthHub/History

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Conditions.html',
        'text!templates/popups/FilterView.html',
], function($, _, Backbone, tpl, filterTpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'conditions',
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
			var body = 	"<label data-id='recentVisits' class='checked'>Recent Visits<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
						"<label data-id='problems' class='checked'>Problems<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
						"<label data-id='procedures' class='checked'>Procedures<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
						"<label data-id='allergies' class='checked'>Allergies<img src='img/healthHub/CheckmarkOrange.png'/></label>";
			
			// close existing popup
			if($('div #filterView').length > 0){
				$('div #filterView').toggle();
				return;
			}
			else {
				$('#conditions').append(self.filterTpl({body: body}));	
			}
		},

		changeView: function(e){
			var target	= e.currentTarget;
			var div		= $(target).attr('data-id');

			$(target).toggleClass('checked');

			$('#' +div).toggle();
			this.container.refreshScroll();
		}

	});
});
