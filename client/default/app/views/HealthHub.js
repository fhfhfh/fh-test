/**
 * Backbone view for the HealthHub screen of the app
 */

define(['jquery',
        'underscore',
        'backbone',
        'iscroll',
        'models/Acts',
        'models/User',
        'text!templates/pages/HealthHub.html'
], function($, _, Backbone, iScroll, Acts, User, template) {


	//interface----------------------------------
	var healthHub = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'healthHub',
	    events	: {
	    },
	    template: template,

			initialize			: _initialize,		// Used to refresh iScroll on content
			render				: _render

	});


	//implementation-------------------------------
	var user = new User();

	function _initialize(){
		_.bindAll(this);
      	var self = this;

		this.$el.html(template);
		this.$content = this.$('#home-content');
		this.$nav = this.$('#home-nav');
		// this.$('#show-news').addClass('selected');
		this.render();
	};

	function _render(){
		return this;
	};
	
	return healthHub;

});
