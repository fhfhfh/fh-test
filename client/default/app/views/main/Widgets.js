define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/widgets/WidgetLibrary',
  'views/main/widgets/MyWidgets',
  'views/main/widgets/RecommendedWidgets',
  'text!templates/pages/Widgets.html'
], function($, _, Backbone, ContainerView, LibraryView, MyWidgetsView, RecommendedView, template) {

  return ContainerView.extend({
    tagName	: 'section',
    id		: 'widgets',

    events : {
      'click #show-library'		: 'showLibrary',
      'click #show-myWidgets'	: 'showMyWidgets',
      'click #show-recommended'	: 'showRecommended'
    },

    subViews: {
      library		: new LibraryView(),
      myWidgets		: new MyWidgetsView(),
      recommended	: new RecommendedView()
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
      this.setActiveView('library');
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
        // this.setActiveView(self.activeView);
      }
      this.$('li').removeClass('selected');
      this.$('#show-library').addClass('selected');
      return this;
    },

    refreshScroll: function(){
      var self = this;
      if(this.iscroll){
        this.iscroll.refresh.call(self.iscroll);        
      }
    },

    showLibrary : function(){
      this.$('li').removeClass('selected');
      this.$('#show-library').addClass('selected');
      this.setActiveView('library');
      this.refreshScroll();
    },

    showMyWidgets : function(){
      this.$('li').removeClass('selected');
      this.$('#show-myWidgets').addClass('selected');
      this.setActiveView('myWidgets');
      this.refreshScroll();
    },

    showRecommended : function(){
      this.$('li').removeClass('selected');
      this.$('#show-recommended').addClass('selected');
      this.setActiveView('recommended');
      this.refreshScroll();
    }

  });
});
