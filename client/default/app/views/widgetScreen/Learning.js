/**
 * @fileOverview The Foodometer Widget
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/Learning.html',
    'models/Calendar',
     // when taking the above lines out, make sure it is reflected in the following line also
], function($, _, Backbone, tpl, calendar) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'foodometer', // change when implemented
        template: _.template(tpl),
        events: {
          },

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());
            this.showEmptyScreen();
            return this;
        },

        // specific to foodometer only
        showEmptyScreen: function(){
            this.$('#mealContainer').hide();
            this.$('#emptyFood').show();
        }

    });
});