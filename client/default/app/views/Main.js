/*--------------------
	app/views/Main

	Main content area of app
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/pages/Main.tpl',
        'views/Headline-news',
        'iScroll',
        'models/Acts',
        'models/User'
], function($, _, Backbone, template, NewsView, iScroll, Acts, User) {


	//interface----------------------------------
	var main = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'main',
	    events	: {
	      'click #show-news': 'showNews',
	      'click #show-goals': 'showGoals',
	      'click #show-alerts': 'showAlerts'
	    },
	    template: template,
	    el 		: $('body'),

		initialize			: _initialize,		// Used to refresh iScroll on content
		render				: _render,
		showNews			: _showNews,		// Show news tab
		showGoals			: _showGoals,		// Show goals tab
		toggleSelectedTab	: _toggleSelectedTab,// switch between tabs
		loadProfile 		: _loadProfile	 	// download user info from cloud

	});


	//implementation-------------------------------
	var user = new User();

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

		// this.showNews();
		this.loadProfile();
		
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

    function _loadProfile(){
    	var self = this;
    	Acts.call('userProfileAction', {}, 
    		function(res){
    			user.setProfile(res.payload.userDetails);
    			var prof = user.getProfile();
    			user.saveUser(function(res){
    				console.log('Saved User: ',res);
    			});
    			user.loadUser(function(res,data){
    				console.log(res, data);
    			});
    			// prof = JSON.stringify(prof.userDetails);
    			// prof = prof.replace(/\,/g, ',<br/>');
    			// this.$('#home-content').html('<div>' +prof + '</div>');
    	}, function(err, msg){
    			console.log(err, msg);
    	});

    }
	
	return main;

});