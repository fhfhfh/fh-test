/**
 * @fileOverview The Food selection screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'views/ContainerView',
    'views/widgetScreen/FoodScreen/Foodometer',
    'views/widgetScreen/FoodScreen/SimpleSearch',
    'views/widgetScreen/FoodScreen/Scan',
    'views/widgetScreen/FoodScreen/RecentFavs',
    'text!templates/widgets/FoodScreen.html'
], function($, _, Backbone, ContainerView, Foodometer, SimpleSearch, Scan, RecentFavs, tpl ) {
    return ContainerView.extend({
        tagName: 'section',
        id: 'foodScreen',
        template: _.template(tpl),
        events: {
            'click #foodometerList': 'foodometer',
            'click #simpleSearch'  : 'simpleSearch',
            'click #scan'          : 'scan',
            'click #favorites'     : 'favorites',
            'click #cancelBtn'     : 'cancelFoodEntry',
            'click #saveBtn'       : 'saveAllFoods'
        },

        subViews: {
            foodometer  : new Foodometer(),
            simpleSearch: new SimpleSearch(),
            scan        : new Scan(),
            recentFavs  : new RecentFavs()
        },

        initialize: function() {
            _.bindAll(this);
            this.$el.html(this.template);
            this.$content = this.$('#subView');
            this.$buttons = this.$('#filterButtons');
        },

        render: function() {
            this.setActiveView('foodometer');
            this.delegateEvents();
            if (this.activeView) {
                this.activeView.delegateEvents();
            }

            $("span#meal").text("Lunch - ("+this.container.foodItems.length+")");
            return this;
        },

        cancelFoodEntry: function(e){
            $('#filterButtons').show();
            this.foodometer();
            this.activeView.cancelFood();
            this.activeView.hideCategories();
            this.model = null;
            this.container.setActiveView('foodometerNav');
        },

        saveAllFoods: function(){
            this.container.subViews.foodometerNav.saveFoodsToJournal();
            this.container.setActiveView('foodometerNav');

        },

        foodometer : function(){
          this.$buttons.find('li').removeClass('selected');
          this.$buttons.find('#foodometerList').addClass('selected');
          this.setActiveView('foodometer');
        },

        simpleSearch : function(){
          this.$buttons.find('li').removeClass('selected');
          this.$buttons.find('#simpleSearch').addClass('selected');
          this.setActiveView('simpleSearch');
        },

        scan : function(){
          this.$buttons.find('li').removeClass('selected');
          this.$buttons.find('#scan').addClass('selected');
          this.setActiveView('scan');
        },

        favorites : function(){
          this.$buttons.find('li').removeClass('selected');
          this.$buttons.find('#favorites').addClass('selected');
          this.setActiveView('recentFavs');
        }

    });
});



