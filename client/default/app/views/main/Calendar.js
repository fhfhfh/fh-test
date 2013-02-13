define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/calendar/Month',
  'views/main/calendar/Year',
  'views/main/calendar/Insights',
  'text!templates/pages/Calendar2.html',
  'models/Acts'
], function($, _, Backbone, ContainerView, MonthView, YearView, InsightsView, template) {

  return ContainerView.extend({
    tagName	: 'section',
    id		: 'calendar',

    events : {
      'click #show-insights': 'showInsights',
      'click #show-month'	: 'showMonth',
      'click #show-year'	: 'showYear'
    },

    subViews: {
      month		: new MonthView(),
      year		: new YearView(),
      insights	: new InsightsView()
    },

    initialize: function(options) {
      var self = this;

      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#calendar-content');
    },

    render: function() {
      var self = this;
      self.setActiveView('month');  
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
      }
      this.$('li').removeClass('selected');
      this.$('#show-month').addClass('selected');
      return this;
    },

    showMonth : function(){
      this.$('li').removeClass('selected');
      this.$('#show-month').addClass('selected');
      this.setActiveView('month');
    },

    showYear : function(){
      this.$('li').removeClass('selected');
      this.$('#show-year').addClass('selected');
      this.setActiveView('year');
    },

    showInsights : function(){
      this.$('li').removeClass('selected');
      this.$('#show-insights').addClass('selected');
      this.setActiveView('insights');
    },

  });
});
