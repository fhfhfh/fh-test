define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/library/Featured',
  'views/main/library/Videos',
  'views/main/library/Articles',
  'views/main/library/Suggested',
  'text!templates/pages/Library.html'
], function($, _, Backbone, ContainerView, FeaturedView, VideosView, ArticlesView, SuggestedView, template) {

  return ContainerView.extend({
    tagName	: 'section',
    id		: 'library',

    events : {
      'click #show-featured'	: 'showFeatured',
      'click #show-videos'		: 'showVideos',
      'click #show-articles'	: 'showArticles',
      'click #show-suggested'	: 'showSuggested'
    },

    subViews: {
      featured	: new FeaturedView(),
      videos	: new VideosView(),
      articles	: new ArticlesView(),
      suggested	: new SuggestedView(),
    },

    initialize: function(options) {
      var self = this;
      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#library-content');
    },

    render: function() {
      var self = this;
      this.setActiveView('featured');
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
        // this.setActiveView(self.activeView);
      }
      this.$('li').removeClass('selected');
      this.$('#show-featured').addClass('selected');
      return this;
    },

    refreshScroll: function(){
      if(this.container){
        this.container.refreshScroll();  
      }
    },

    showFeatured : function(){
      this.$('li').removeClass('selected');
      this.$('#show-featured').addClass('selected');
      this.setActiveView('featured');
    },

    showVideos : function(){
      this.$('li').removeClass('selected');
      this.$('#show-videos').addClass('selected');
      this.setActiveView('videos');
    },

    showArticles : function(){
      this.$('li').removeClass('selected');
      this.$('#show-articles').addClass('selected');
      this.setActiveView('articles');
    },

    showSuggested : function(){
      this.$('li').removeClass('selected');
      this.$('#show-suggested').addClass('selected');
      this.setActiveView('suggested');
    }

  });
});
