/**
 * Backbone view for the Widgets screen of the app
 */

define(['jquery',
        'underscore',
        'backbone',
        'iscroll',
        'models/Acts',
        'models/User',
        'text!templates/pages/Widgets.html'
], function($, _, Backbone, iScroll, Acts, User, template) {


	//interface----------------------------------
	var widgets = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'widgets',
	    events	: {
	    },
	    template: template,

			initialize			: _initialize,		// Used to refresh iScroll on content
			render				: _render,
			toggleSelectedTab	: _toggleSelectedTab,// switch between tabs

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

    function _toggleSelectedTab(selectedId) {
		this.$('#content-tab-list li').each(function(index, tab) {
			tab = $(tab);
			if (tab.attr('id') == selectedId) {
				tab.addClass('selected');
			} else {
				tab.removeClass('selected');
			}
		})
    };
	
	return widgets;

});
