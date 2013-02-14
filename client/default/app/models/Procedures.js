/*------------------
app/models/Procedures

Model for Procedures items
--------------------------*/

define(['backbone',
		'models/Acts'
	], function(Backbone, Act) {


	var procedures = Backbone.Model.extend({

		initialize: function(){
		},

		fetch: function(){
			var self = this;
			var data = {};

			Act.call('fetchProceduresAction', {}, function(res){
				data = res.payload.procedures;

				self.attributes = self.parse(data);
				
			}, function(err, msg){
				console.log(err, msg);
				Backbone.trigger('notify', 'Error getting Procedures from Cloud');
			});
		},

		parse: function(data){
			console.log(data);
			return data;
		}

	});

	return procedures;
});