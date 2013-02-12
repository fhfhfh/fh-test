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
	    	"click #add-alert"		: "checkAlerts",
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

		checkAlerts: function(e){
			var self = this;

			// User clicked Sync button
			if(e){
				self.model.fetchAlerts(function(res){
					self.populate();
					return;
				});
			}
			// check if model is empty and if screen has been populated
			else if(this.model.isEmpty()){
				this.model.fetchAlerts(function(res){
					self.populate();
				});
			}
			else if(self.count() <= 3){
				self.populate();
			}
		},

		render : function(){
			this.$el.html(tpl);
			this.$('#allBtn').addClass('selected');
			this.checkAlerts();
			return this;
		},

		refreshScroll: function(){
			if(this.container){
				this.container.refreshScroll();  
			}
		},

		showAll: function(){
			this.$('li').removeClass('selected');
			$('#allBtn').addClass('selected');
			$('#alert-list').show();
			$('#reminder-list').show();
			$('#expiration-list').show();
			this.refreshScroll();
		},

		showAlerts: function(){
			this.$('li').removeClass('selected');
			$('#alertsBtn').addClass('selected');
			$('#alert-list').show();
			$('#reminder-list').hide();
			$('#expiration-list').hide();
			this.refreshScroll();
		},

		showReminders: function(){
			this.$('li').removeClass('selected');
			$('#remindersBtn').addClass('selected');
			$('#alert-list').hide();
			$('#reminder-list').show();
			$('#expiration-list').hide();
			this.refreshScroll();
		},

		showExpirations: function(){
			this.$('li').removeClass('selected');
			$('#expirationsBtn').addClass('selected');
			$('#alert-list').hide();
			$('#reminder-list').hide();
			$('#expiration-list').show();
			this.refreshScroll();
		},

		populate: function(){
			var self = this;
			var entries		= this.model.entries;
			var alerts		= entries.alerts;
			var reminders	= entries.reminders;
			var expirations	= entries.expirations;

			// empty all alerts etc.
			$('#alert-list div').remove();
			$('#reminder-list div').remove();
			$('#expiration-list div').remove();

			for(var i=0; i<alerts.length; i++){
				var cls = self.mapAlert(alerts[i].noticeSeverityText);
				var html = 
					'<div class="alert '+cls+'">'+
					alerts[i].noticeSummary +
					'<span id="date">' + alerts[i].noticeDueDate.split(' ')[0] +'</span></div>'
				self.$('#alert-list').append(html);
			}
			for(var i=0; i<reminders.length; i++){
				var cls = self.mapAlert(reminders[i].noticeSeverityText);
				var html = 
					'<div class="alert '+cls+'">'+
					reminders[i].noticeSummary +
					'<span id="date">' + reminders[i].noticeDueDate.split(' ')[0] +'</span></div>'
				self.$('#reminder-list').append(html);
			}
			for(var i=0; i<expirations.length; i++){
				var cls = self.mapAlert(expirations[i].noticeSeverityText);
				var html = 
					'<div class="alert '+cls+'">'+
					expirations[i].noticeSummary +
					'<span id="date">' + expirations[i].noticeDueDate.split(' ')[0] +'</span></div>'
				self.$('#expiration-list').append(html);
			}

			if(alerts.length < 1){
				$('#alert-list p').remove();
				$('#alert-list').append('<p> No alerts added yet.</p>');
			}
			if(reminders.length < 1){
				$('#reminder-list p').remove();
				$('#reminder-list').append('<p> No reminders added yet.</p>');
			}
			if(expirations.length < 1){
				$('#expiration-list p').remove();
				$('#expiration-list').append('<p> No expirations added yet.</p>');
			}
			// <div class="alert redtip">
			// 	You haven't completed your health risk assessment.
			// 	<span id="date">Yesterday</span>
			// </div>

			this.refreshScroll();
		},


		// map an alerts priority to a css class
		mapAlert: function(priority){
			var cls = '';
			switch(priority){
				case 'High':
					cls = 'redtip';
					break;
				case 'Medium':
					cls = 'orangetip';
					break;
				case 'Low':
					cls = '';
					break;
				default:
					cls = '';
					break;
			}
			return cls;
		},

		count: function(){
			var total = 0
			total += $('#alert-list').children().length;
			total += $('#reminder-list').children().length;
			total += $('#expiration-list').children().length;
			
			return total;
		}

	});
});
