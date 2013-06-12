/*--------------------
	app/models/Calendar

	Module used to create Calendar elements within the app
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'feedhenry'
], function($, _, Backbone, $fh) {


	//interface----------------------------------
	var calendar = Backbone.Model.extend({

		monthName: [
            'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'
        ],

        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],

		initialize: function(){
			var date = new Date();
			this.date		= date;
            this.month		= date.getMonth();
            this.year		= date.getFullYear();
            this.dateStr	= date.toString('dddd, MMMM ,yyyy');
            this.firstDay	= this.getFirstDay(date);

            this.dateStr = this.dateStr.split(' ')[0] + ' ' + this.dateStr.split(' ')[1] +' '+ this.dateStr.split(' ')[2];
		},

		getMonthStr: function(num){
			return this.monthName[num];
		},

		getDayStr: function(num){
			return this.dayName[num];
		},


		/*
		 * Pass in a month and year,
		 * returns the number of days in that month
		 */
        daysInMonth: function(month,year) {
            month = month +1;
            return new Date(year, month, 0).getDate();
        },


        /*
         * Passing in a date object,
         * This function will return the first day of the month
         * (0 = Sunday, 1 = Monday etc.)
         */
        getFirstDay: function(date){
            var month = date.getMonth();
            //                        alert(month);
            var year = date.getFullYear();

            var dateObj = new Date();

            dateObj.setFullYear(year);
            dateObj.setMonth(month);
            dateObj.setDate(1);
            var first = dateObj.getDay();

            return first;
        }
	});

	return calendar;

});