/*------------------
app/models/Encounters

Model for Encounters items
--------------------------*/

define(['backbone',
		'models/Acts'
	], function(Backbone, Act) {


	var encounters = Backbone.Model.extend({

		initialize: function(){
		},

		fetch: function(){
			var self = this;
			var data = {};

			Act.call('fetchEncountersAction', {}, function(res){
				data = res.payload.encounters;

				self.attributes = self.parse(data);
				
			}, function(err, msg){
				console.log(err, msg);
				Backbone.trigger('notify', 'Error getting Encounters from Cloud');
			});
		},

		parse: function(data){
			console.log(data);
			return data;
		}

	});

	return encounters;
});