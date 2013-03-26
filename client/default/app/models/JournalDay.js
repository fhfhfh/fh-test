/*------------------
app/models/JournalDay

Model for A Food journal day of entry
--------------------------*/

define(['backbone'], function(Backbone) {

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
			console.log('Journal Day created');
		},

		// Return true is no meals have been added to model
		isEmpty: function(){
			var att = this.attributes;
			var b = att.breakfast.length;
			var l = att.lunch.length;
			var d = att.dinner.length;
			var s = att.snacks.length;
			var bs= att.beverages.length;
			if((b + l + d + s + bs)==0){
				return true;
			} else {
				return false;
			}
		}

	});


	return journalDay;
});