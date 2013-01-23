define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/home/News',
  'views/main/home/Goals',
  'views/main/home/Alerts',
  'text!templates/pages/Home.html',
  'models/Acts'
], function($, _, Backbone, ContainerView, NewsView, GoalsView, AlertsView, template, Act) {

  return ContainerView.extend({
    tagName	: 'section',
    id		: 'home',

    events : {
      'click #show-news' : 'showNews',
      'click #show-alerts' : 'showAlerts',
      'click #show-goals' : 'showGoals'
    },

    subViews: {
      news  : new NewsView(),
      goals : new GoalsView(),
      alerts: new AlertsView()
    },

    initialize: function(options) {
      var self = this;

      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#home-content');
      this.$nav = this.$('#home-nav');
      this.$('#show-news').addClass('selected');

      this.setActiveView(((options && options.activeView) || 'news'));
    },

    render: function() {
      var self = this;
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
      }
      return this;
    },

    showNews : function(){
      this.$('li').removeClass('selected');
      this.$('#show-news').addClass('selected');
      this.setActiveView('news');
    },

    showAlerts : function(){
      this.$('li').removeClass('selected');
      this.$('#show-alerts').addClass('selected');
      this.setActiveView('alerts');
    },

    showGoals : function(){
      this.$('li').removeClass('selected');
      this.$('#show-goals').addClass('selected');
      this.setActiveView('goals');
    },

  });
});
