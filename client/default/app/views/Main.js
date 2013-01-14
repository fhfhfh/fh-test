/**
 * @fileOverview: Backbone view which encapsulates the main content area of the
 * application.
 */

define(['jquery',
        'underscore',
        'backbone',
        'views/ContainerView',
        'views/main/Home',
        'views/components/TopBar',
        'text!templates/main.html',
        'iscroll',
        'views/Widgets',
        'views/HealthHub',
        'views/Connect',
        'views/Calendar',
        'views/Library',
], function($, _, Backbone, ContainerView, HomeView, TopBar, template, iScroll, WidgetsView, HealthHubView, ConnectView, CalendarView, LibraryView) {


	//interface----------------------------------
	return ContainerView.extend({
		tagName	: 'section',
    id		: 'main',

    subViews: {
      home: new HomeView(),
      widgets : new WidgetsView(),
      healthHub : new HealthHubView(),
      connect : new ConnectView(),
      calendar : new CalendarView(),
      library : new LibraryView()
    },

    initialize: function(options) {
      var self = this;

      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#main-content');
      this.$nav = this.$('#main-nav');
      this.$topBar = this.$('#top-bar');

      this.iscroll = new iScroll(this.$('#main-iscroll')[0], {
        hscroll: false,
        fixedScrollbar: true,
        bounce: false,
        vScrollbar: false
      });
      var topbar = new TopBar();

      this.setActiveView(((options && options.activeView) || 'home'));

      Backbone.View.prototype.refreshScroll = function() {
        setTimeout(function() {
          if (self.iscroll) {
            self.iscroll.refresh.call(self.iscroll);
          }
        }, 100);
      };
    },

    render: function() {
      this.refreshScroll();
      return this;
    }
	});
});
