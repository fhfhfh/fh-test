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

                for(j=1;j<time.length;j++){
                    var item=time[j];
                    console.log(item);
                    calories      += parseFloat(item.calories) || 0;
                }
                totals.calories = calories;
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

        // Return true if no activities have been added to model
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
            console.log(this);

            var att  = this.attributes;
            var m    = att.morning;
            var a    = att.afternoon;
            var e    = att.evening;
            var o    = att.other;
            var arr  = [m,a,e,o];

            for(var i=0;i<arr.length;i++){
                var time = arr[i][0];
                calories      += time.calories || 0;
            }
            this.set("calories", calories);
        }

    });

    return model;
});