/*--------------------
	app/views/main/calendar/month

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Month.html',
], function($, _, Backbone, tpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'month',
	    events		: {
	    	'mousedown .days td' : 'hover',
	    	'mouseup .days td' : 'hoverOff'
	    },
	    template	: _.template(tpl),


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

		hover: function(e){
			var target = e.currentTarget;			
			$(target).append("<div id='popDate'>Hello World</div>");
		},

		hoverOff: function(e){
			var target = e.currentTarget;
			$('#popDate').remove();
		}

	});
});
