/*------------------
app/models/FoodItem

Model for CalorieKing Food items
--------------------------*/

define(['backbone'], function(Backbone) {


	var item = Backbone.Model.extend({

		defaults: {
			name			: 'Untitled',
			fullname		: 'Description not available',
			calories		: 0,
			protein 		: 0.0,
			total_fat 		: 0.0,
			total_carbohydrate: 0.0,
			sodium	 		: 0.0,
			cholesterol 	: 0.0,
			serving 		: [ {name: "quantity (1 oz)", size: "20.5"}]
		},

		initialize: function(){
		},

	});


	return item;
});