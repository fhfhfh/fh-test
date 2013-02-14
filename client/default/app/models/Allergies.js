/*------------------
app/models/Allergies

Model for Allergies items
--------------------------*/

define(['backbone',
		'models/Acts'
	], function(Backbone, Act) {


	var allergies = Backbone.Model.extend({

		initialize: function(){
		},

		fetch: function(){
			var self = this;
			var data = {};

			Act.call('fetchAllergiesAction', {}, function(res){
				data = res.payload.allergies;

				self.attributes = self.parse(data);
				
			}, function(err, msg){
				console.log(err, msg);
				Backbone.trigger('notify', 'Error getting Allergies from Cloud');
			});
		},

		parse: function(data){
			console.log(data);
			return data;
		}

	});

	return allergies;
});