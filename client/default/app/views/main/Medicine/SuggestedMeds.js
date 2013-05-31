/**
 * @fileOverview Suggested Medicines Screen
 * SubView of Medicine
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/SuggestedMeds.html'
], function($, _, Backbone, tpl) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'suggestedMedsScreen',
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



