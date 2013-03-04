/*--------------------
	app/views/main/healthHub/Hub

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Data.html',
        'text!templates/popups/FilterView.html',
        'text!templates/components/HealthHubRow.html',
], function($, _, Backbone, tpl, filterTpl, rowTpl) {

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
			this.$el.html(this.template());
		},

		render: function(){
			this.populate();
			return this;
		},

		showFilter: function(){
			var self = this;
			var body = "<input type='checkbox' checked name='measure' value='true' id='measure'/><label data-id='measurements' class='checked' for='measure'>Measurements <img src='img/healthHub/CheckmarkOrange.png'/></label><input type='checkbox' checked name='results' value='true' id='results'/><label data-id='testResults' class='checked' for='results'>Test Results<img src='img/healthHub/CheckmarkOrange.png'/></label><input type='checkbox' checked name='immune' value='true' id='immune'/><label data-id='immunizations' class='checked' for='immune'>Immunizations<img src='img/healthHub/CheckmarkOrange.png'/></label>";
			
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

			$(target).toggleClass('checked');

			$('#' +div).toggle();
			this.container.refreshScroll();

		},

		// Force param is a boolean, to say whether to force a refresh of data or not
		populate: function(force){
			var self = this;
			var data = this.container.healthHubData;
			var row = _.template(rowTpl);
			if(data){

				// Measurements
				if(force || self.$('#measurements #body #row').length < 1){
					// Clear measurements body
					self.$('#measurements #body #row').remove();

					var str = 	row({name: 'Height', value: data.vitalSigns[0].bodyHeight}) +
								row({name: 'Weight', value: data.vitalSigns[0].bodyWeight}) +
								row({name: 'Diastolic Bp', value: data.vitalSigns[0].diastolicBp}) +
								row({name: 'Systolic Bp', value: data.vitalSigns[0].systolicBp});

					self.$('#measurements #body').append(str);
				}

				// Test Results
				if(force || self.$('#testResults #body #row').length < 1){
					self.$('#testResults #body #row').remove();
					var str = '';
					for(var i=0; i<data.results.length; i++){

						str += row({name: data.results[i].testName, 
									value: data.results[i].result + ' '+ data.results[i].units});
				    }
				    self.$('#testResults #body').append(str);
				}

				// Immunizations
				if(force || self.$('#immunizations #body #row').length < 1){
					self.$('#immunizations #body #row').remove();
					var str = '';
					for(var i=0; i<data.immunizations.length; i++){

						str += row({name: data.immunizations[i].vaccine, 
									value: data.immunizations[i].status});					    
				    }
				    self.$('#immunizations #body').append(str);
				}
			}
		}

	});
});