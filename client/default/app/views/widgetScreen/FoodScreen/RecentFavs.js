/**
 * @fileOverview The Food selection screen
 * SubView of FoodScreen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'views/ContainerView',
    'views/widgetScreen/FoodScreen/RecentItems',
    'views/widgetScreen/FoodScreen/MyFavourites',
    'text!templates/widgets/FoodScreen/RecentFavs.html'
], function($, _, Backbone, ContainerView, RecentItems, MyFavourites, tpl) {

    return ContainerView.extend({

        tagName: 'section',
        id: 'recentFavsScreen',
        template: _.template(tpl),
        events: {
            'click #show-recentItems'   : 'showRecentItems',
            'click #show-myFavourites'  : 'showMyFavourites'
        },

        subViews: {
            recentItems : new RecentItems(),
            myFavourites : new MyFavourites()
        },

        initialize: function() {
            _.bindAll(this);
            this.$el.html(this.template);
            this.$content = this.$('#recentFavs-content');
        },

        render: function() {
            this.setActiveView('recentItems');
            this.delegateEvents();
            if(this.activeView){
                this.activeView.delegateEvents();
            }
            return this;
        },

        refreshScroll: function(){
            var self = this;
            if(this.iscroll){
                this.iscroll.refresh.call(self.iscroll);        
            }
        },

        showRecentItems: function(){
            this.$('li').removeClass('selected');
            this.$('#show-recentItems').addClass('selected');
            this.setActiveView('recentItems');
            this.refreshScroll();
        },

        showMyFavourites: function(){
            this.$('li').removeClass('selected');
            this.$('#show-myFavourites').addClass('selected');
            this.setActiveView('myFavourites');
            this.refreshScroll();
        }

    });
});



