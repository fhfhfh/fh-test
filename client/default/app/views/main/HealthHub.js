define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/healthHub/History',
  'views/main/healthHub/Data',
  'views/main/healthHub/Conditions',
  'text!templates/pages/HealthHub.html'
], function($, _, Backbone, ContainerView, HistoryView, DataView, ConditionsView, template) {

  return ContainerView.extend({
    tagName	: 'section',
    id		: 'healthHub',

    events : {
      'click #show-history'		: 'showHistory',
      'click #show-data'			: 'showData',
      'click #show-conditions'	: 'showConditions'
    },

    subViews: {
      history	: new HistoryView(),
      data		: new DataView(),
      conditions: new ConditionsView()
    },

    initialize: function(options) {
      var self = this;
      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#healthHub-content');
      this.$('#show-data').addClass('selected');
      
    },

    render: function() {
      var self = this;
      this.setActiveView('data');
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
        // this.setActiveView(self.activeView);
      }
      return this;
    },

    refreshScroll: function(){
      if(this.container){
        this.container.refreshScroll();  
      }
    },

    showHistory : function(){
      this.$('li').removeClass('selected');
      this.$('#show-history').addClass('selected');
      this.setActiveView('history');
    },

    showData : function(){
      this.$('li').removeClass('selected');
      this.$('#show-data').addClass('selected');
      this.setActiveView('data');
    },

    showConditions : function(){
      this.$('li').removeClass('selected');
      this.$('#show-conditions').addClass('selected');
      this.setActiveView('conditions');
    }

  });
});
