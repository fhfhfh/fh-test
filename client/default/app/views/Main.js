/**
 * @fileOverview: Backbone view which encapsulates the main content area of the
 * application.
 */

define(['zepto',
        'underscore',
        'backbone',
        'text!templates/pages/Main.html',
        'views/home/News',
        'views/home/Goals',
        'views/home/Alerts',
        'iscroll',
        'models/Acts',
        'models/User'
], function($, _, Backbone, template, NewsView, GoalsView, AlertsView, iScroll, Acts, User) {


	//interface----------------------------------
	var main = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'main-content',
	    events	: {
	      'click #show-news'		: 'showNews',
	      'click #show-goals'		: 'showGoals',
	      'click #show-alerts'		: 'showAlerts',
	      'click #profile-button'	: 'showProfile'
	    },
	    template: template,
	    el 		: $('#body'),

		initialize			: _initialize,		// Used to refresh iScroll on content
		render				: _render,
		showNews			: _showNews,		// Show news tab
		showGoals			: _showGoals,		// Show goals tab
		showAlerts 			: _showAlerts,		// Show alerts tab
		toggleSelectedTab	: _toggleSelectedTab,// switch between tabs
		showProfile 		: _showProfile 		// open user profile page

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
		var $el			= $('#body').html(template);
		var scroller	= $el.find('#main-content')[0];

		this.showNews();

		this.iscroll = new iScroll(scroller, {
			hscroll: false,
			fixedScrollbar: true,
			bounce: false,
			vScrollbar: false
        });

		return $el;
	};

	function _showNews() {
		this.toggleSelectedTab('show-news');
		var newsView = new NewsView();
		this.$('#home-content').html(newsView.render().el);
		this.refreshScroll();
    };

    function _showGoals() {
		this.toggleSelectedTab('show-goals');
		var goalsView = new GoalsView();
		this.$('#home-content').html(goalsView.render());
		this.refreshScroll();
    };

    function _showAlerts() {
		this.toggleSelectedTab('show-alerts');
		var alertsView = new AlertsView();
		this.$('#home-content').html(alertsView.render());
		this.refreshScroll();
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

    function _showProfile(){
    	App.navigate('profile', true)
    }
	
	return main;

});
