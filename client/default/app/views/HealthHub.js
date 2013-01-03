/**
 * Backbone view for the HealthHub screen of the app
 */

define(['zepto',
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
	    id		: 'main-content',
	    el 		: $('#content'),
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

		Backbone.View.prototype.refreshScroll = function() {
			setTimeout(function() {
				if (self.iscroll) {
					self.iscroll.refresh.call(self.iscroll);
				}
			}, 100);
		};

		this.refreshScroll();
		this.render();
	};

	function _render(){
		this.$el.html(template);
		var scroller = this.$el.find('#main-content')[0];

		this.iscroll = new iScroll(scroller, {
			hscroll: false,
			fixedScrollbar: true,
			bounce: false,
			vScrollbar: false
        });

		return this;
	};
	
	return healthHub;

});
