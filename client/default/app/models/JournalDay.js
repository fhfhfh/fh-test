/*------------------
app/models/JournalDay

Model for A Food journal day of entry
--------------------------*/

define(['backbone'], function(Backbone) {

	var journalDay = Backbone.Model.extend({

		defaults: {
			date			: new Date(),
			goalCals		: 1500,
			remainingCals	: 1500,
			currentCals		: 0

		},

		initialize: function(){
			console.log('Journal Day created');

			// initialize values
			this.set("breakfast",[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);
			this.set("lunch",[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);
			this.set("dinner",[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);
			this.set("snacks",[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);
			this.set("beverages",[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);

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

			// make sure date is valid
			if(typeof att.date != "object"){
				var badDate = att.date;
				att.date = new Date(badDate);
			}
		},

		clearMeal: function(meal){
			this.set(meal,[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);
		},

		recalculateNutrients: function(){
			var self = this;
			var att  = this.attributes;
			var b    = att.breakfast;
			var l    = att.lunch;
			var d    = att.dinner;
			var s    = att.snacks;
			var bs   = att.beverages;
			var arr  = [b,l,d,s,bs];
			var i,j;
			for(i=0;i<arr.length;i++){
				var meal          = arr[i];
				var totals        = meal[0];
				var calories      = 0;
				var fat           = 0;
				var cholesterol   = 0;
				var sodium        = 0;
				var carbohydrates = 0;
				var fibre         = 0;
				var protein       = 0;

				for(j=1;j<meal.length;j++){
					var item=meal[j];
					calories      += parseFloat(item.calories) || 0;
					fat           += parseFloat(item.total_fat) || 0;
					cholesterol   += parseFloat(item.cholesterol) || 0;
					sodium        += parseFloat(item.sodium) || 0;
					carbohydrates += parseFloat(item.carbohydrates) || 0;
					fibre         += parseFloat(item.fibre) || 0;
					protein       += parseFloat(item.protein) || 0;
				}
				totals.calories = calories;
				totals.fat = fat;
				totals.cholesterol = cholesterol;
				totals.sodium = sodium;
				totals.carbohydrates = carbohydrates;
				totals.fibre = fibre;
				totals.protein = protein;
				self.set(meal[0], totals);
			}
			this.addTotals();
			var bCals = this.getCals(b);
			var lCals = this.getCals(l);
			var dCals = this.getCals(d);
			var sCals = this.getCals(s);
			var bsCals= this.getCals(bs);
			var sum = bCals+lCals+dCals+sCals+bsCals;
			this.set("currentCals", sum);
			this.set("remainingCals", att.goalCals - sum);
		},

		// Return true is no meals have been added to model
		isEmpty: function(){
			var att = this.attributes;
			var b = att.breakfast.length ;
			var l = att.lunch.length;
			var d = att.dinner.length;
			var s = att.snacks.length;
			var bs= att.beverages.length;
			if((b + l + d + s + bs)<=5){
				return true;
			} else {
				return false;
			}
		},

		getCals: function(meal){
			if(meal.length === 0){
				return 0;
			} else {
				return parseInt(meal[0].calories, 10);
			}
		},

		addTotals: function(){
			var self = this;
			var calories      = 0;
			var fat           = 0;
			var cholesterol   = 0;
			var sodium        = 0;
			var carbohydrates = 0;
			var fibre         = 0;
			var protein       = 0;

			var att  = this.attributes;
			var b    = att.breakfast;
			var l    = att.lunch;
			var d    = att.dinner;
			var s    = att.snacks;
			var bs   = att.beverages;
			var arr  = [b,l,d,s,bs];

			for(var i=0;i<arr.length;i++){
				var meal = arr[i][0];
				calories      += meal.calories || 0;
				fat           += meal.total_fat || 0;
				cholesterol   += meal.cholesterol || 0;
				sodium        += meal.sodium || 0;
				carbohydrates += meal.carbohydrates || 0;
				fibre         += meal.fibre || 0;
				protein       += meal.protein || 0;
			}
			this.set("calories", calories);
			this.set("fat", fat);
			this.set("cholesterol", cholesterol);
			this.set("sodium", sodium);
			this.set("carbohydrates", carbohydrates);
			this.set("fibre", fibre);
			this.set("protein", protein);
		}

	});

	return journalDay;
});