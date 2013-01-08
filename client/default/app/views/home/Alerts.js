/*--------------------
	app/views/Alerts

	View containing user alerts
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Alerts.html'
], function($, _, Backbone, tpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'alerts',
	    events		: {
	    	"click #allBtn"			: "showAll",
	    	"click #alertsBtn"		: "showAlerts",
	    	"click #remindersBtn"	: "showReminders",
	    	"click #expirationsBtn"	: "showExpirations"
	    },
	    template	: _.template(tpl),


		initialize : function(){
			_.bindAll(this);
		},

		render : function(){
			this.$el.html(tpl);
			console.log($(this)[0]);
			return $(this)[0];
		},

		showAll: function(){
			$('#alert-list').show();
			$('#reminder-list').show();
			$('#expiration-list').show();
		},

		showAlerts: function(){
			$('#alert-list').show();
			$('#reminder-list').hide();
			$('#expiration-list').hide();
		},

		showReminders: function(){
			$('#alert-list').hide();
			$('#reminder-list').show();
			$('#expiration-list').hide();
		},

		showExpirations: function(){
			$('#alert-list').hide();
			$('#reminder-list').hide();
			$('#expiration-list').show();
		},
	});
});
