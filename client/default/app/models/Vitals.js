/*------------------
app/models/Vitals

Model for Vital details items
--------------------------*/

define(['backbone',
		'models/Acts'
	], function(Backbone, Act) {


	var vitals = Backbone.Model.extend({

		initialize: function(){
		},

		fetch: function(){
			var self = this;
			var data = {};

			Act.call('fetchVitalsignsAction', {}, function(res){
				data = res.payload.vitalSigns[0];

				self.attributes = self.parse(data);
				
			}, function(err, msg){
				console.log(err, msg);
				Backbone.trigger('notify', 'Error getting Vitals from Cloud');
			});
		},

		parse: function(data){
			console.log(data);
			return data;
		}

	});

	return vitals;
});