define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/calendar/Month',
  'views/main/calendar/Year',
  'views/main/calendar/Insights',
  'text!templates/pages/Calendar.html',
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

      this.iscroll = new iScroll(this.$('#wrapper')[0], {
          hscroll: false,
          fixedScrollbar: true,
          bounce: false,
          vScrollbar: false
      });
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
      this.refreshScroll();
      return this;
    },

    refreshScroll: function(){
      var self = this;
      if(this.iscroll){
        this.iscroll.refresh.call(self.iscroll);        
      }
    },

    showMonth : function(){
      this.$('li').removeClass('selected');
      this.$('#show-month').addClass('selected');
      this.setActiveView('month');
      this.refreshScroll();
    },

    showYear : function(){
      this.$('li').removeClass('selected');
      this.$('#show-year').addClass('selected');
      this.setActiveView('year');
      this.refreshScroll();
    },

    showInsights : function(){
      this.$('li').removeClass('selected');
      this.$('#show-insights').addClass('selected');
      this.setActiveView('insights');
      this.refreshScroll();
    },

  });
});
