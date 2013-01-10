/*--------------------
	app/views/Alerts

	View containing user alerts
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/components/Alerts.html'
], function($, _, Backbone, template) {

	//interface--------------------------------------
	var alerts = Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'alerts',
	    events		: {
	    },
	    template	: _.template(template),
            events  : {
	    	'click #all'            : 'showAll',
	    	'click #alert_btn'	: 'showAlerts',
                'click #reminder_btn'	: 'showReminder',
                'click #expiration_btn'	: 'showExpiration'
	    },
	    el 		: $('#home-content'),
            

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
                showAll         : _showAll,
                showAlerts      : _showAlerts,
                showReminder    : _showReminder,
                showExpiration  : _showExpiration
                

	});


	//implementation-------------------------------

	function _initialize(){
		_.bindAll(this);
	};

	function _render(){
		this.$el.html(template);
		var html = '<section id="alerts">'+template+'</section>';

		return html;
	};
        
        function _showAll(){
		alert("Show All");
                console.log("**********&&&&&&&&&^^^^^^^^^^^^%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
	};
        
        function _showAlerts(){
		alert("Show Alerts");
	};
        
        function _showReminder(){
		alert("Show Reminder");
	};
        
        function _showExpiration(){
		alert("Show Expiration");
	};


	return alerts;

});