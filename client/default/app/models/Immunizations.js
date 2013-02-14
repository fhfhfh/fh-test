/*------------------
app/models/Immunizations

Model for Immunizations items
--------------------------*/

define(['backbone',
		'models/Acts'
	], function(Backbone, Act) {


	var immunizations = Backbone.Model.extend({

		initialize: function(){
		},

		fetch: function(){
			var self = this;
			var data = {};

			Act.call('fetchImmunizationsAction', {}, function(res){
				data = res.payload.immunizations;

				self.attributes = self.parse(data);
				
			}, function(err, msg){
				console.log(err, msg);
				Backbone.trigger('notify', 'Error getting Immunizations from Cloud');
			});
		},

		parse: function(data){
			console.log(data);
			return data;
		}

	});

	return immunizations;
});