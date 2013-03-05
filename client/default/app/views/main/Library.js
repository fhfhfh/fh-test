define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/library/MyMedia',
  'views/main/library/ReadingRoom',
  'views/main/library/Research',
  'views/main/library/Suggested',
  'text!templates/pages/Library.html'
], function($, _, Backbone, ContainerView, MyMediaView, ReadingRoomView, ResearchView, SuggestedView, template) {

  return ContainerView.extend({
    tagName	: 'section',
    id		: 'library',

    events : {
      'click #show-myMedia'    : 'showMyMedia',
      'click #show-readingRoom': 'showReadingRoom',
      'click #show-research'   : 'showResearch',
      'click #show-suggested'  : 'showSuggested'
    },

    subViews: {
      myMedia    : new MyMediaView(),
      readingRoom: new ReadingRoomView(),
      research   : new ResearchView(),
      suggested  : new SuggestedView(),
    },

    initialize: function(options) {
      var self = this;
      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#library-content');

      this.iscroll = new iScroll(this.$('#wrapper')[0], {
          hscroll: false,
          fixedScrollbar: true,
          bounce: false,
          vScrollbar: false
      });
    },

    render: function() {
      var self = this;
      this.setActiveView('myMedia');
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
        // this.setActiveView(self.activeView);
      }
      this.$('li').removeClass('selected');
      this.$('#show-myMedia').addClass('selected');
      return this;
    },

    refreshScroll: function(){
      var self = this;
      if(this.iscroll){
        this.iscroll.refresh.call(self.iscroll);        
      }
    },

    showMyMedia : function(){
      this.$('li').removeClass('selected');
      this.$('#show-myMedia').addClass('selected');
      this.setActiveView('myMedia');
      this.refreshScroll();
    },

    showReadingRoom : function(){
      this.$('li').removeClass('selected');
      this.$('#show-readingRoom').addClass('selected');
      this.setActiveView('readingRoom');
      this.refreshScroll();
    },

    showResearch : function(){
      this.$('li').removeClass('selected');
      this.$('#show-research').addClass('selected');
      this.setActiveView('research');
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
