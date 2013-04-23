/**
 * @fileOverview The Food selection screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/FoodScreen.html',
], function($, _, Backbone, tpl) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'foodScreen',
        template: _.template(tpl),
        events: {
            'click .foodItem' : 'selectFood',
            'click .boxEntry' : 'showFoodItemScreen',
            'click #cancelBtn' : 'cancel'
        },

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        /* 
         * Event when a food category is selected
         * Check whether it is level1 or level2 category
         */
        selectFood: function(e){
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
            }
        },
        
        cancel : function(){
            this.container.setActiveView('foodometer');
        },

        showFoodItemScreen: function(e){
            var target = $(e.currentTarget);
        }
    });
});