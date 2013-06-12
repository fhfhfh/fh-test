/*--------------------
	app/views/main/healthHub/History

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/History.html',
        'text!templates/popups/FilterView.html',
        'text!templates/components/HealthHubRow.html'
], function($, _, Backbone, tpl, filterTpl, rowTpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
		id			: 'history',
		events		: {
			'click #viewBtn' : 'showFilter',
			'click label' : 'changeView'
		},
		template	: _.template(tpl),
		filterTpl	: _.template(filterTpl),


		initialize : function(){
			_.bindAll(this);
			this.$el.html(this.template());
		},

		render: function(){
			this.populate();
            return this;
		},

		showFilter: function(){
                        var self = this;
			var body = "<input type='checkbox' checked name='family' value='true' id='family'/><label data-id='familyHistory' class='checked' for='family'>Family History <img src='img/healthHub/CheckmarkOrange.png'/></label><input type='checkbox' checked name='social' value='true' id='social'/><label data-id='socialHistory' class='checked' for='social'>Social History<img src='img/healthHub/CheckmarkOrange.png'/></label>";

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

			$(target).toggleClass('checked');

			$('#' +div).toggle();
			this.container.refreshScroll();
		},

		// Force param is a boolean, to say whether to force a refresh of data or not
		populate: function(force){
			var self = this;
			var data = this.container.healthHubData;
			var row = _.template(rowTpl);
			var str;
			if(data){

				// Family History
				if(force || self.$('#familyHistory #body #row').length < 1){
					self.$('#familyHistory #body #row').remove();
					str = '';
					for(var i=0; i<data.familyHistories.length; i++){

						str += row({name: data.familyHistories[i].familyMember,
									value: data.familyHistories[i].diagnosis});
					}
					self.$('#familyHistory #body').append(str);
				}

				// Social History
				if(force || self.$('#socialHistory #body #row').length < 1){
					self.$('#socialHistory #body #row').remove();
					str = '';
					for(var j=0; j<data.socialHistories.length; j++){

						str += row({name: data.socialHistories[j].socialHistoryElement,
									value: data.socialHistories[j].description});
					}
					self.$('#socialHistory #body').append(str);
				}
			}
		}
	});
});
