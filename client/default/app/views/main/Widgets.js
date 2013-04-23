define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/widgets/WidgetStore',
  'views/main/widgets/MyWidgets',
  'views/main/widgets/WidgetsSuggested',
  'text!templates/pages/Widgets.html'
], function($, _, Backbone, ContainerView, StoreView, MyWidgetsView, SuggestedView, template) {

  return ContainerView.extend({
    tagName : 'section',
    id    : 'widgets',

    events : {
      'click #show-store'   : 'showStore',
      'click #show-myWidgets' : 'showMyWidgets',
      'click #show-suggested' : 'showSuggested'
    },

    subViews: {
      store             : new StoreView(),
      myWidgets         : new MyWidgetsView(),
      suggested          : new SuggestedView()
    },

    initialize: function(options) {
      var self = this;
      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#widgets-content');

      this.iscroll = new iScroll(this.$('#wrapper')[0], {
          hscroll: false,
          fixedScrollbar: true,
          bounce: false,
          vScrollbar: false
      });
    },

    render: function() {
      var self = this;
      this.setActiveView('myWidgets');
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
        // this.setActiveView(self.activeView);
      }
      this.$('li').removeClass('selected');
      this.$('#show-myWidgets').addClass('selected');
      return this;
    },

    refreshScroll: function(){
      var self = this;
      if(this.iscroll){
        this.iscroll.refresh.call(self.iscroll);        
      }
    },

    showStore : function(){
      this.$('li').removeClass('selected');
      this.$('#show-store').addClass('selected');
      this.setActiveView('store');
      this.refreshScroll();
    },

    showMyWidgets : function(){
      this.$('li').removeClass('selected');
      this.$('#show-myWidgets').addClass('selected');
      this.setActiveView('myWidgets');
      this.refreshScroll();
    },

    showSuggested : function(){
      this.$('li').removeClass('selected');
      this.$('#show-suggested').addClass('selected');
      this.setActiveView('suggested');
      this.refreshScroll();
    }

  });
});
