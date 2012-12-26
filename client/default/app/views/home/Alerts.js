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
	    el 		: $('#home-content'),

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template

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


	return alerts;

});