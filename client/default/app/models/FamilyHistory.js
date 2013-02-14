/*------------------
app/models/FamilyHistory

Model for FamilyHistory items
--------------------------*/

define(['backbone',
		'models/Acts'
	], function(Backbone, Act) {


	var familyHistory = Backbone.Model.extend({

		initialize: function(){
		},

		fetch: function(){
			var self = this;
			var data = {};

			Act.call('fetchFamilyHistoryAction', {}, function(res){
				data = res.payload.familyHistories;

				self.attributes = self.parse(data);
				
			}, function(err, msg){
				console.log(err, msg);
				Backbone.trigger('notify', 'Error getting Family History from Cloud');
			});
		},

		parse: function(data){
			console.log(data);
			return data;
		}

	});

	return familyHistory;
});