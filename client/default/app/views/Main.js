/*--------------------
	app/views/Main

	Main content area of app
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/pages/Main.tpl',
        'views/Headline-news',
        'iScroll'
], function($, _, Backbone, template, NewsView, iScroll) {


	//interface----------------------------------
	Peachy.Views.Main = Backbone.View.extend({

		// Backbone specific attributes
		tagName: 'section',
	    id: 'main',
	    events: {
	      'click #show-news': 'showNews',
	      'click #show-goals': 'showGoals'
	    },

		initialize			: _initialize,		// Used to refresh iScroll on content
		render				: _render,
		showNews			: _showNews,		// Show news tab
		showGoals			: _showGoals,		// Show goals tab
		toggleSelectedTab	: _toggleSelectedTab// switch between tabs

	});


	//implementation-------------------------------

	function _initialize(){
		_.bindAll(this);
      	var self = this;
      	this.render();

		Backbone.View.prototype.refreshScroll = function() {
			setTimeout(function() {
				if (self.iscroll) {
					self.iscroll.refresh.call(self.iscroll);
				}
			}, 100);
		};

		this.showNews();
		
	    this.iscroll = new iScroll($('#main-content'), {
			hscroll: false,
			fixedScrollbar: true,
			bounce: false,
			vScrollbar: false
        });

		this.refreshScroll();
	};

	function _render(){
		var $el = $('body').html(template);
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
		this.$('#home-content').html('');
		this.refreshScroll();
    };

    function _toggleSelectedTab(selectedId) {
		this.$('#content-tab-list li').each(function(index, tab) {
			tab = $(tab);
			console.log(tab);
			if (tab.attr('id') == selectedId) {
				tab.addClass('selected');
			} else {
				tab.removeClass('selected');
			}
		})
    };
	
	return Peachy.Views.Main;

});