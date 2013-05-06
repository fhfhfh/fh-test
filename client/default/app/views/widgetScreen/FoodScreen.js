/**
 * @fileOverview The Food selection screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/FoodScreen.html',
    'collections/Foods'
], function($, _, Backbone, tpl, collection) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'foodScreen',
        collection: collection,
        template: _.template(tpl),
        events: {
            'click .foodItem' : 'selectFood',
            'click .boxEntry' : 'showFoodItemScreen',
            'click #cancelBtn': 'cancelFoodEntry'
        },

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());

            this.level1Scroll = new iScroll(this.$('#level1Food')[0],{
                hScroll     : true,
                vScroll     : false,
                hScrollbar  : false,
                bounceLock  : true,
                bounce      : false
            });
            this.refreshScroll();
            return this;
        },

        refreshScroll: function(){
            var self = this;
            setTimeout(function(){
                self.level1Scroll.refresh();
            }, 100);
        },

        /* 
         * Event when a food category is selected
         * Check whether it is level1 or level2 category
         */
        selectFood: function(e){
            var self = this;
            var target = $(e.currentTarget);

            if(target.hasClass('lv1')){
                $('.foodItem.lv1').removeClass('selected');
                var name = target.attr('data-id');

                $('.foods2').hide();
                $('.foods2.'+name).show();
                $('#foodList').hide();
            }
            else if(target.hasClass('lv2')){
                $('.foodItem.lv2').removeClass('selected');
                $('#foodList').show();
            }
            
            target.addClass('selected');

            // if both level categories are selected, show foodList
            if($('.foodItem.lv1').hasClass('selected') && $('.foodItem.lv2:visible').hasClass('selected')){
                $('#foodList').show();
                self.populateFoodList(target);
            }
            this.refreshScroll();
        },
        
        cancel : function(){
            this.container.setActiveView('foodometer');
        },

        showFoodItemScreen: function(e){
            var target = $(e.currentTarget);
        },

        cancelFoodEntry: function(e){
            this.container.setActiveView('foodometerNav');
        },

        populateFoodList: function(el){
            var target = $(el);
            var name = target.attr('data-name');
            console.log(name);

            // pull foods into collection before populating screen
            this.collection.getFoods(name, function(res){
//                alert(res);
            });
        }

    });
});



