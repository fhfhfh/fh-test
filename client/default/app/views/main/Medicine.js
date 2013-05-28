define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/Medicine/FeaturedMeds',
  'views/main/Medicine/FavouriteMeds',
  'views/main/Medicine/ResearchMeds',
  'views/main/Medicine/SuggestedMeds',
  'text!templates/pages/Medicine.html'
], function($, _, Backbone, ContainerView, FeaturedMedsView, FavouriteMedsView, ResearchMedsView, SuggestedMedsView, template) {

  return ContainerView.extend({
    tagName	: 'section',
    id		: 'medicine',

    events : {
      'click #show-medFeatured' : 'showMedFeatured',
      'click #show-medFavourites' : 'showMedFavourites',
      'click #show-medResearch' : 'showMedResearch',
      'click #show-medSuggested' : 'showMedSuggested',
    },

    subViews: {
      featuredMeds : new FeaturedMedsView(),
      favouriteMeds : new FavouriteMedsView(),
      researchMeds : new ResearchMedsView(),
      suggestedMeds : new SuggestedMedsView(),
    },

    initialize: function(options) {
      var self = this;

      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#medicine-content');

      this.iscroll = new iScroll(this.$('#wrapper')[0], {
          hscroll: false,
          fixedScrollbar: true,
          bounce: false,
          vScrollbar: false
      });  
    },

    render: function() {
      var self = this;

      self.setActiveView('featuredMeds');
      this.delegateEvents();
      if (this.activeView){
        this.activeView.delegateEvents();
      }
      this.$('li').removeClass('selected');
      this.$('#show-medFeatured').addClass('selected');

      return this;
    },

    refreshScroll: function(){
      var self = this;
      if(this.iscroll){
      this.iscroll.refresh.call(self.iscroll);
      }
    },

    showMedFeatured : function(){
      this.$('li').removeClass('selected');
      this.$('#show-medFeatured').addClass('selected');
      this.setActiveView('featuredMeds');
      this.refreshScroll();
    },

    showMedFavourites : function(){
      this.$('li').removeClass('selected');
      this.$('#show-medFavourites').addClass('selected');
      this.setActiveView('favouriteMeds');
      this.refreshScroll();
    },

    showMedResearch : function(){
      this.$('li').removeClass('selected');
      this.$('#show-medResearch').addClass('selected');
      this.setActiveView('researchMeds');
      this.refreshScroll();
    },

    showMedSuggested : function(){
      this.$('li').removeClass('selected');
      this.$('#show-medSuggested').addClass('selected');
      this.setActiveView('suggestedMeds');
      this.refreshScroll();
    },
  });
});
