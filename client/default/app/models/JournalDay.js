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
			breakfast 		: [{calories: "0", location: "", with : "", time: "", notes: ""}],
			lunch 			: [{calories: "0", location: "", with : "", time: "", notes: ""}],
			dinner 			: [{calories: "0", location: "", with : "", time: "", notes: ""}],
			snacks 			: [{calories: "0", location: "", with : "", time: "", notes: ""}],
			beverages 		: [{calories: "0", location: "", with : "", time: "", notes: ""}]
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
				this.set("currentCals", sum);
				this.set("remainingCals", att.remainingCals - sum);
			}

			this.on("change", this.recalculateNutrients);
		},

		recalculateNutrients: function(){
			var att = this.attributes;
			var b 	= att.breakfast;
			var l = att.lunch;
			var d = att.dinner;
			var s = att.snacks;
			var bs= att.beverages;
			var arr = [b,l,d,s,bs];
			var i,j;
			for(i=0;i<arr.length;i++){
				var meal = arr[i];
				var totals = meal[0];
				totals.calories = 0;
				totals.fat = 0;
				totals.cholesterol = 0;
				totals.sodium =0;
				totals.carbohydrates =0;
				totals.fibre = 0;
				totals.protein = 0;
				
				for(j=1;j<meal.length;j++){
					var item=meal[i];
					totals.calories += item.calories;
					totals.fat += item.total_fat;
					totals.cholesterol += item.cholesterol;
					totals.sodium += item.sodium;
					totals.carbohydrates += item.carbohydrates;
					totals.fibre += item.fibre;
					totals.protein += item.protein;
				}
			}
			var bCals = this.getCals(b);
			var lCals = this.getCals(l);
			var dCals = this.getCals(d);
			var sCals = this.getCals(s);
			var bsCals= this.getCals(bs);
			var sum = bCals+lCals+dCals+sCals+bsCals;
			this.set("currentCals", sum);
			this.set("remainingCals", att.remainingCals - sum);
			console.log(this);
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