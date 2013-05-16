/**
 * @fileOverview The Scan Screen
 * SubView of FoodScreen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/FoodScreen/Scan.html'
], function($, _, Backbone, tpl) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'scanScreen',
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



