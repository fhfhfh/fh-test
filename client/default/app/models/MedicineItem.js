/*------------------
app/models/MedicineItem

Model for items in a users medicine cabinet
--------------------------*/

define(['backbone'], function(Backbone) {


	var item = Backbone.Model.extend({

		defaults: {
			name		: 'Untitled',
			fullname	: 'Description not available',
			type		: 'medication',
			startDate 	: new Date(),
			endDate 	: new Date()
		},

		initialize: function(){
		},

	});


	return item;
});