/**
 * @fileOverview The Food selection screen
 * SubView of FoodScreen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/FoodScreen/RecentFavs.html'
], function($, _, Backbone, tpl) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'recentFavsScreen',
        template: _.template(tpl),
        events: {

        },

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

    });
});



