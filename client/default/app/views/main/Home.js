define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/home/News',
  'views/main/home/Goals',
  'views/main/home/Alerts',
  'text!templates/pages/Home.html'
], function($, _, Backbone, ContainerView, NewsView, GoalsView, AlertsView, template) {

  return ContainerView.extend({
    tagName: 'section',
    id: 'home',

    events: {
      'click #show-news': 'showNews',
      'click #show-alerts': 'showAlerts',
      'click #show-goals': 'showGoals'
    },

    subViews: {
      news: new NewsView(),
      goals: new GoalsView(),
      alerts: new AlertsView()
    },

    initialize: function(options) {
      var self = this;

      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#home-content');
      this.$nav = this.$('#home-nav');

      // this.iscroll = new iScroll(this.$('#wrapper')[0], {
      //   vscroll: true,
      //     hscroll: false,
      //     fixedScrollbar: true,
      //     bounce: false,
      //     vScrollbar: false
      // });

      // self.setActiveView(((options && options.activeView) || 'news'));  

    },

    render: function() {
      var self = this;

      self.setActiveView('news');
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
      }
      this.$('li').removeClass('selected');
      this.$('#show-news').addClass('selected');

      return this;
    },

    refreshScroll: function() {
      var self = this;
      if (this.iscroll) {
        this.iscroll.refresh.call(self.iscroll);
        this.iscroll.scrollTo(0, 0, 200);
      }
    },

    showNews: function() {
      this.$('li').removeClass('selected');
      this.$('#show-news').addClass('selected');
      this.setActiveView('news');
      this.refreshScroll();
    },

    showAlerts: function() {
      this.$('li').removeClass('selected');
      this.$('#show-alerts').addClass('selected');
      this.setActiveView('alerts');
      this.refreshScroll();
    },

    showGoals: function() {
      this.$('li').removeClass('selected');
      this.$('#show-goals').addClass('selected');
      this.setActiveView('goals');
      this.refreshScroll();
    },

  });
});
