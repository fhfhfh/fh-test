/*------------------
app/models/Problems

Model for Problems items
--------------------------*/

define(['backbone',
		'models/Acts'
	], function(Backbone, Act) {


	var problems = Backbone.Model.extend({

		initialize: function(){
		},

		fetch: function(){
			var self = this;
			var data = {};

			Act.call('fetchProblemsAction', {}, function(res){
				data = res.payload.problems;

				self.attributes = self.parse(data);
				
			}, function(err, msg){
				console.log(err, msg);
				Backbone.trigger('notify', 'Error getting Problems from Cloud');
			});
		},

		parse: function(data){
			console.log(data);
			return data;
		}

	});

	return problems;
});