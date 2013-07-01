/*--------------------
	app/views/main/healthHub/History

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Conditions.html',
        'text!templates/popups/FilterView.html',
        'text!templates/components/HealthHubRow.html'
], function($, _, Backbone, tpl, filterTpl, rowTpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
		id			: 'conditions',
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
			var body =	"<label data-id='recentVisits' class='checked'>Recent Visits<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
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
		},

		// Force param is a boolean, to say whether to force a refresh of data or not
		populate: function(force){
			var self = this;
			var data = this.container.healthHubData;
			var row = _.template(rowTpl);
			var str;
			if(data){

				// Recent Visits
				if(force || self.$('#recentVisits #body #row').length < 1){
					self.$('#recentVisits #body #row').remove();
					str = '';
					for(var i=0; i<data.encounters.length; i++){

						str += row({name: data.encounters[i].encounter,
									value: data.encounters[i].location});
					}
					self.$('#recentVisits #body').append(str);
				}

				// Problems
				if(force || self.$('#problems #body #row').length < 1){
					self.$('#problems #body #row').remove();
					str = '';
					for(var j=0; j<data.problems.length; j++){

						str += row({name: data.problems[j].problem,
									value: data.problems[j].status});
					}
					self.$('#problems #body').append(str);
				}

				// Procedures
				if(force || self.$('#procedures #body #row').length < 1){
					self.$('#procedures #body #row').remove();
					str = '';
					for(var k=0; k<data.procedures.length; k++){

						str += row({name: data.procedures[k].procedure,
									value: data.procedures[k].description});
					}
					self.$('#procedures #body').append(str);
				}

				// Allergies
				if(force || self.$('#allergies #body #row').length < 1){
					self.$('#allergies #body #row').remove();
					str = '';
					for(var l=0; l<data.allergies.length; l++){

						str += row({name: data.allergies[l].allergy,
									value: data.allergies[l].reaction});
					}
					self.$('#allergies #body').append(str);
				}
			}
		}

	});
});