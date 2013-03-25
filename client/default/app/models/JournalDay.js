/*------------------
app/models/JournalDay

Model for A Food journal day of entry
--------------------------*/

define(['backbone'], function(Backbone) {

	// TODO: Implement any custom logic necessary once backend in place.

	var journalDay = Backbone.Model.extend({

		defaults: {
			date 			: new Date(),
			goalCals 		: 1500,
			remainingCals 	: 1500,
			currentCals 	: 0,
			breakfast 		: [],
			lunch 			: [],
			dinner 			: [],
			snacks 			: [],
			beverages 		: []
		},

		initialize: function(){
			console.log('Journal Day created'):
		},

	});


	return journalDay;
});