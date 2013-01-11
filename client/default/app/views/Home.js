/**
 * @fileOverview The default homepage contained within the main view of the app,
 * which in turn contains the news, alerts and goals sections.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/home/News'
], function($, _, Backbone, ContainerView, NewsView) {

  return ContainerView.extend({
    events	: {
      'click #show-news'		: 'showNews',
      'click #show-goals'		: 'showGoals',
      'click #show-alerts'		: 'showAlerts'
    },

    subViews: {
      news: new NewsView(),
//      goals: new GoalsView(),
//      alerts: new AlertsView()
    }
  });
});
