/*------------------
app/models/ActivityDay

Model for A Activity journal day of entry
--------------------------*/

define(['backbone'], function(Backbone) {

    var model = Backbone.Model.extend({

        defaults: {
            date            : new Date(),
            goalCals        : 1500,
            remainingCals   : 1500,
            currentCals     : 0

        },

        initialize: function(){
            console.log('Activity Day created');

            // initialize values
            this.set("morning",[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);
            this.set("afternoon",[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);
            this.set("evening",[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);
            this.set("other",[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);

            var att = this.attributes;

            //Calculate Calories
            if(this.isEmpty()){
                this.set('currentCals', 0);
            }
            else {
                var mCals = this.getCals(att.morning);
                var aCals = this.getCals(att.afternoon);
                var eCals = this.getCals(att.evening);
                var oCals = this.getCals(att.other);
                var sum = mCals+aCals+eCals+oCals;
                this.set("currentCals", sum);
                this.set("remainingCals", att.remainingCals - sum);
            }

            // make sure date is valid
            if(typeof att.date != "object"){
                var badDate = att.date;
                att.date = new Date(badDate);
            }
        },

        clearTime: function(time){
            this.set(time,[{calories: "0", location: "", "with" : "", time: "", notes: ""}]);
        },

        recalculateNutrients: function(){
            var self = this;
            var att  = this.attributes;
            var m    = att.morning;
            var a    = att.afternoon;
            var e    = att.evening;
            var o    = att.other;
            var arr  = [m,a,e,o];
            var i,j;
            for(i=0;i<arr.length;i++){
                var time          = arr[i];
                var totals        = time[0];
                var calories      = 0;
                var fat           = 0;
                var cholesterol   = 0;
                var sodium        = 0;
                var carbohydrates = 0;
                var fibre         = 0;
                var protein       = 0;

                for(j=1;j<time.length;j++){
                    var item=time[j];
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
                self.set(time[0], totals);
            }
            this.addTotals();
            var mCals = this.getCals(m);
            var aCals = this.getCals(a);
            var eCals = this.getCals(e);
            var oCals = this.getCals(o);
            var sum = mCals+aCals+eCals+oCals;
            this.set("currentCals", sum);
            this.set("remainingCals", att.goalCals - sum);
        },

        // Return true is no times have been added to model
        isEmpty: function(){
            var att = this.attributes;
            var m = att.morning.length;
            var a = att.afternoon.length;
            var e = att.evening.length;
            var o = att.other.length;

            if((m + a + e + o)<=5){
                return true;
            } else {
                return false;
            }
        },

        getCals: function(time){
            if(time.length === 0){
                return 0;
            } else {
                return parseInt(time[0].calories, 10);
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
            var m    = att.breakfast;
            var a    = att.lunch;
            var e    = att.dinner;
            var o    = att.snacks;
            var arr  = [m,a,e,o];

            for(var i=0;i<arr.length;i++){
                var time = arr[i][0];
                calories      += time.calories || 0;
                fat           += time.total_fat || 0;
                cholesterol   += time.cholesterol || 0;
                sodium        += time.sodium || 0;
                carbohydrates += time.carbohydrates || 0;
                fibre         += time.fibre || 0;
                protein       += time.protein || 0;
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

    return model;
});