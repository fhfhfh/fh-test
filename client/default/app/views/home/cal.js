/*--------------------
	app/views/Goals

	View containing user goals
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/components/cal.html'
], function($, _, Backbone, template) {

	//interface--------------------------------------
	var calendar1 = Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'calendar1',
	    events		: {
//	    'click #add-goal'   : 'addGoal'
	    },
	    template	: _.template(template),
	    el 		: $('#home-content'),

	    //Function interface
		initialize	: _initialize,
		render		: _render		// return template
//		addGoal 	: _addGoal

	});


	//implementation-------------------------------

	function _initialize(){
		_.bindAll(this);
                
                
                var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		
		                    
//                    fullCalendar({
//                    
//			header: {
//				left: 'prev,next today',
//				center: 'title',
//				right: 'month,agendaWeek,agendaDay'
//			},
//			selectable: true,
//			selectHelper: true,
//			select: function(start, end, allDay) {
//				var title = prompt('Event Title:');
//				if (title) {
//					calendar.fullCalendar('renderEvent',
//						{
//							title: title,
//							start: start,
//							end: end,
//							allDay: allDay
//						},
//						true // make the event "stick"
//					);
//				}
//				calendar.fullCalendar('unselect');
//			},
//			editable: true,
//			events: [
//				{
//					title: 'All Day Event',
//					start: new Date(y, m, 1)
//				},
//				{
//					title: 'Long Event',
//					start: new Date(y, m, d-5),
//					end: new Date(y, m, d-2)
//				},
//				{
//					id: 999,
//					title: 'Repeating Event',
//					start: new Date(y, m, d-3, 16, 0),
//					allDay: false
//				},
//				{
//					id: 999,
//					title: 'Repeating Event',
//					start: new Date(y, m, d+4, 16, 0),
//					allDay: false
//				},
//				{
//					title: 'Meeting',
//					start: new Date(y, m, d, 10, 30),
//					allDay: false
//				},
//				{
//					title: 'Lunch',
//					start: new Date(y, m, d, 12, 0),
//					end: new Date(y, m, d, 14, 0),
//					allDay: false
//				},
//				{
//					title: 'Birthday Party',
//					start: new Date(y, m, d+1, 19, 0),
//					end: new Date(y, m, d+1, 22, 30),
//					allDay: false
//				},
//				{
//					title: 'Click for Google',
//					start: new Date(y, m, 28),
//					end: new Date(y, m, 29),
//					url: 'http://google.com/'
//				}
//			]
//		});
                
//                alert(calendar);
	};

	function _render(){
		this.$el.html(template);
		var html = '<section id="calendar1">'+template+'</section>';

		return html;
	};

//	function _addGoal(){
		// TODO: need flats from customer
//	};


	return calendar1;

});