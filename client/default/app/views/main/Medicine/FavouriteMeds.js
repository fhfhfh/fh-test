/**
 * @fileOverview Favourites Medicines Screen
 * SubView of Medicine
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/FavouriteMeds.html'
], function($, _, Backbone, tpl) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'favouriteMedsScreen',
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



