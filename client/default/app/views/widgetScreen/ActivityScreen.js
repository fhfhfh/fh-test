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
            this.setActiveView('busyBody');
            this.time = this.container.time;
            this.delegateEvents();
            if (this.activeView) {
                this.activeView.delegateEvents();
            }

            $("span#time").text(self.time+" - ("+this.container.activityItems.length+")");
            return this;
        },

        cancelActivityEntry: function(e){
            this.model = null;
            this.container.setActiveView('busyBodyNav');
        },

        saveAllActivities: function(){
            this.container.subViews.busyBodyNav.saveActivitiesToJournal();
            this.container.setActiveView('busyBodyNav');

        },

        busyBody : function(){
          this.$buttons.find('li').removeClass('selected');
          this.$buttons.find('#busyBody').addClass('selected');
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



