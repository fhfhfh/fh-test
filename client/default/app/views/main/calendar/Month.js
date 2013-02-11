/*--------------------
	app/views/main/calendar/month

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Month.html',
        'text!templates/popups/DayEvents.html',
], function($, _, Backbone, tpl, dayEventTpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'month',
	    events		: {
	    	'click .days td'	: 'eventsOn',
	    	'click #editEvents'	: 'editEvent'
	    },
	    template	: _.template(tpl),
	    dayTpl 		: _.template(dayEventTpl),
	    monthName: [
		'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
		'October', 'November', 'December'
		],


		initialize : function(){
			var self = this;
			_.bindAll(this);
			var date		= new Date();
			this.date		= date;
			this.month		= date.getMonth();
			this.year		= date.getFullYear();
			this.dateStr	= date.toString('dddd, MMMM ,yyyy');
			this.firstDay	= this.getFirstDay(date);

			this.dateStr = this.dateStr.split(' ')[0] + ' ' + this.dateStr.split(' ')[1] +' '+ this.dateStr.split(' ')[2];

		},

		render: function(){
			var self = this;
			this.$el.html(this.template({
				today: self.dateStr
			}));
			this.renderCal();

			return this;
		},

	 	daysInMonth: function(month,year) {
	 		var month = month +1;
		    return new Date(year, month, 0).getDate();
		},

		getFirstDay: function(date){
			var month = date.getMonth();
			var year = date.getFullYear();

			var dateObj = new Date();

			dateObj.setFullYear(year);
			dateObj.setMonth(month);
			dateObj.setDate(1);
			var first = dateObj.getDay();

			return first;
		},

		renderCal: function(){
			var self = this;
			var days = this.$('.days td');
			var first = this.firstDay;
			var today = new Date().getDate();
			var cls = '';
			var monthLength = this.daysInMonth(self.month, self.year);

			var num = 1;
			for(var i=first; i<monthLength + first ; i++){
				if(num == today){
					cls = 'today';
				}
				else {
					cls = '';
				}

				$(days[i]).html("<div class='day'>" + num + "</div>");
				$(days[i]).addClass(cls);
				
				num = num +1;
			}
		},


		/* Show a pop-up to display information/events
		 * about a given day. These events will be read dynamically from
		 * an Events model/collection for each date.
		 */
		eventsOn: function(e){
			$('#popDate').remove();

			var self = this;
			var month = this.monthName[self.month];
			var target = e.currentTarget;
			var day = $(target).find('.day').html();

			var dateModel = '';// get Events model Item for the date that is clicked

			var html = 	this.dayTpl({
				date: month + ' ' + day + ', ' + self.year,
				energy: dateModel.energy || 'n/a',
				mood: dateModel.mood || 'n/a',
				diet: dateModel.diet || 'n/a'
			});

			if(day != undefined){
				$(target).append(html);
				$('#popDate').hide().slideDown(200);


				// Close window after 3 seconds
				setTimeout(function(){
					$(target).find('#popDate').slideUp(200);
				}, 4000);
			}
		},

		// Open pop-up for editing/adding/removing events
		// Need more information on what is required here
		editEvent: function(e){
			alert('Need information on what is needed here')
		}

	});
});
