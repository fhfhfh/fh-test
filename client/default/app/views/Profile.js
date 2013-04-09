define([
    'jquery',
    'underscore',
    'backbone',
    'views/ContainerView',
    'views/profiles/General',
    'text!templates/pages/Profile.html',
    'controllers/Profile'
], function($, _, Backbone, ContainerView, GeneralView, template, Controller) {

    return ContainerView.extend({
        tagName : 'section',
        id      : 'profile',
        controller  : new Controller(),

        events : {
          'click #general'      : 'showGeneral',
          'click #privacy'      : 'showPrivacy',
          'click #content'      : 'showContent',
          'click #accessibility': 'showAccess',
        },

        subViews: {
          general  : new GeneralView()
        },

        initialize: function(options) {
            var self = this;
            _.bindAll(this);

            this.$el.html(template);
            this.$content = this.$('#scroller');
            this.$nav = this.$('#main-tabs');    

            // iScroll ---------------------------
            this.iscroll = new iScroll(this.$('#profile-iscroll')[0], {
                hscroll: false,
                fixedScrollbar: true,
                bounce: false,
                vScrollbar: false,
                useTransform: false, 
                onBeforeScrollStart: null
            });   
        },

        render: function() {
          var self = this;
          
          self.setActiveView('general');  
          this.delegateEvents();
          if (this.activeView) {
            this.activeView.delegateEvents();
          }
          this.$('li').removeClass('selected');
          this.$('#main-tabs #general').addClass('selected');

          return this;
        },

        refreshScroll: function(){
          var self = this;
          if(this.iscroll){
          this.iscroll.refresh.call(self.iscroll);        
          }
        },

        saveDetails: function(){
            // this will need to save all sub Views
            this.controller.saveProfile(this.subViews['general']);
        },

        showGeneral : function(){
          this.$('#main-tabs li').removeClass('selected');
          this.$('#main-tabs #general').addClass('selected');
          this.setActiveView('general');
          this.refreshScroll();
        },

        showPrivacy : function(){
          this.$('#main-tabs li').removeClass('selected');
          this.$('#main-tabs #privacy').addClass('selected');
          this.setActiveView('general');
          this.refreshScroll();
        },

        showContent : function(){
          this.$('#main-tabs li').removeClass('selected');
          this.$('#main-tabs #content').addClass('selected');
          this.setActiveView('general');
          this.refreshScroll();
        },

        showAccess : function(){
          this.$('#main-tabs li').removeClass('selected');
          this.$('#main-tabs #accessibility').addClass('selected');
          this.setActiveView('general');
          this.refreshScroll();
        }
    });
});
