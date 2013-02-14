/*------------------
app/models/SocialHistory

Model for SocialHistory items
--------------------------*/

define(['backbone',
		'models/Acts'
	], function(Backbone, Act) {


	var socialHistory = Backbone.Model.extend({

		initialize: function(){
		},

		fetch: function(){
			var self = this;
			var data = {};

			Act.call('fetchSocialHistoryAction', {}, function(res){
				data = res.payload.SocialHistories;

				self.attributes = self.parse(data);
				
			}, function(err, msg){
				console.log(err, msg);
				Backbone.trigger('notify', 'Error getting Social History from Cloud');
			});
		},

		parse: function(data){
			console.log(data);
			return data;
		}

	});

	return socialHistory;
});