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
			var att = this.attributes;

			//Calculate Calories
			if(this.isEmpty()){
				this.set('currentCals', 0);
			}
			else {
				var bCals = this.getCals(att.breakfast);
				var lCals = this.getCals(att.lunch);
				var dCals = this.getCals(att.dinner);
				var sCals = this.getCals(att.snacks);
				var bsCals= this.getCals(att.beverages);
				var sum = bCals+lCals+dCals+sCals+bsCals;
				console.log(bCals,lCals,dCals,sCals,bsCals);
				this.set("currentCals", sum);
				this.set("remainingCals", att.remainingCals - sum);
			}
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
		},

		getCals: function(meal){
			if(meal.length == 0){
				return 0;
			} else {
				return parseInt(meal[0].calories);
			}
		}

	});


	return journalDay;
});