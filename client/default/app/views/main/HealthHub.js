define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/healthHub/History',
  'views/main/healthHub/Hub',
  'views/main/healthHub/Conditions',
  'text!templates/pages/HealthHub.html'
], function($, _, Backbone, ContainerView, HistoryView, HubView, ConditionsView, template) {

  return ContainerView.extend({
    tagName	: 'section',
    id		: 'healthHub',

    events : {
      'click #show-history'		: 'showHistory',
      'click #show-hub'			: 'showHub',
      'click #show-conditions'	: 'showConditions'
    },

    subViews: {
      history	: new HistoryView(),
      hub		: new HubView(),
      conditions: new ConditionsView()
    },

    initialize: function(options) {
      var self = this;
      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#healthHub-content');
      this.$('#show-history').addClass('selected');
      
    },

    render: function() {
      var self = this;
      this.setActiveView('history');
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
        // this.setActiveView(self.activeView);
      }
      return this;
    },

    showHistory : function(){
      this.$('li').removeClass('selected');
      this.$('#show-history').addClass('selected');
      this.setActiveView('history');
    },

    showHub : function(){
      this.$('li').removeClass('selected');
      this.$('#show-hub').addClass('selected');
      this.setActiveView('hub');
    },

    showConditions : function(){
      this.$('li').removeClass('selected');
      this.$('#show-conditions').addClass('selected');
      this.setActiveView('conditions');
    }

  });
});
