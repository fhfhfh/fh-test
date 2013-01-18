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
			this.$('#allBtn').addClass('selected');
			return this;
		},

		showAll: function(){
			this.$('li').removeClass('selected');
			$('#allBtn').addClass('selected');
			$('#alert-list').show();
			$('#reminder-list').show();
			$('#expiration-list').show();
		},

		showAlerts: function(){
			this.$('li').removeClass('selected');
			$('#alertsBtn').addClass('selected');
			$('#alert-list').show();
			$('#reminder-list').hide();
			$('#expiration-list').hide();
		},

		showReminders: function(){
			this.$('li').removeClass('selected');
			$('#remindersBtn').addClass('selected');
			$('#alert-list').hide();
			$('#reminder-list').show();
			$('#expiration-list').hide();
		},

		showExpirations: function(){
			this.$('li').removeClass('selected');
			$('#expirationsBtn').addClass('selected');
			$('#alert-list').hide();
			$('#reminder-list').hide();
			$('#expiration-list').show();
		},
	});
});
