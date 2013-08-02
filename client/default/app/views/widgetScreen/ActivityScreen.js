/**
 * @fileOverview The Activity selection screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'views/ContainerView',
    'views/widgetScreen/ActivityScreen/BusyBody',
    'views/widgetScreen/ActivityScreen/SimpleSearch',
    'views/widgetScreen/ActivityScreen/RecentFavs',
    'text!templates/widgets/ActivityScreen.html'
], function($, _, Backbone, ContainerView, BusyBody, SimpleSearch, RecentFavs, tpl ) {
    return ContainerView.extend({
        tagName: 'section',
        id: 'activityScreen',
        template: _.template(tpl),
        events: {
            'click #busyBodyList'  : 'busyBody',
            'click #simpleSearch'  : 'simpleSearch',
            'click #favorites'     : 'favorites',
            'click #cancelBtn'     : 'cancelActivityEntry',
            'click #saveBtn'       : 'saveAllActivities'
        },

        subViews: {
            busyBody    : new BusyBody(),
            simpleSearch: new SimpleSearch(),
            recentFavs  : new RecentFavs()
        },

        initialize: function() {
            _.bindAll(this);
            this.$el.html(this.template);
            this.$content = this.$('#subView');
            this.$buttons = this.$('#filterButtons');
        },

        render: function() {
            var self = this;
            this.time = this.container.time;
            this.setActiveView('busyBody');
            this.delegateEvents();
            if (this.activeView) {
                this.activeView.delegateEvents();
            }

            $("span#time").text(self.time +" - ("+this.container.activityItems.length+")");
            return this;
        },

        cancelActivityEntry: function(e){
            $('#filterButtons').show();
            this.busyBody();
            this.activeView.cancelActivity();
            this.activeView.hideCategories();
            this.model = null;
            this.container.showBusyBody();
            this.container.refreshScroll();
        },

        saveAllActivities: function(){
            $('#filterButtons').show();
            this.busyBody();
            this.activeView.hideCategories();
            this.container.subViews.busyBodyNav.saveActivitiesToJournal();
            this.container.showBusyBody()
            this.container.refreshScroll();

        },

        busyBody : function(){
          this.$buttons.find('li').removeClass('selected');
          this.$buttons.find('#busyBodyList').addClass('selected');
          this.setActiveView('busyBody');
        },

        simpleSearch : function(){
          this.$buttons.find('li').removeClass('selected');
          this.$buttons.find('#simpleSearch').addClass('selected');
          this.setActiveView('simpleSearch');
        },

        favorites : function(){
          this.$buttons.find('li').removeClass('selected');
          this.$buttons.find('#favorites').addClass('selected');
          this.setActiveView('recentFavs');
        }

    });
});



