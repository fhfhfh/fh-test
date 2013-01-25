/*--------------------
	app/views/Alerts

	View containing user alerts
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Alerts.html',
        'models/Alerts'
], function($, _, Backbone, tpl, Alerts) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'alerts',
	    events		: {
	    	"click #add-alert"		: "bind",
	    	"click #allBtn"			: "showAll",
	    	"click #alertsBtn"		: "showAlerts",
	    	"click #remindersBtn"	: "showReminders",
	    	"click #expirationsBtn"	: "showExpirations"
	    },
	    template	: _.template(tpl),


		initialize : function(){
			_.bindAll(this);
			this.model = new Alerts();
		},

		bind: function(e){
			var self = this;
			this.model.fetchAlerts(function(res){
				self.populate();
			});
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

		populate: function(){
			console.log(this.model);
			var entries		= this.model.entries;
			var alerts		= entries.alerts;
			var reminders	= entries.reminders;
			var expirations	= entries.expirations;

			for(var i=0; i<alerts.length; i++){
				var html = '';
				console.log(i);
				$('#alert-list').append(html);
			}
			for(var i=0; i<reminders.length; i++){
				var html = '';
				console.log(i);
				$('#reminder-list').append(html);
			}
			for(var i=0; i<expirations.length; i++){
				var html = '';
				console.log(i);
				$('#expiration-list').append(html);
			}
			// <div class="alert redtip">
			// 	You haven't completed your health risk assessment.
			// 	<span id="date">Yesterday</span>
			// </div>
		}
	});
});
