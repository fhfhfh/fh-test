/**
 * @fileOverview Research Medicines Screen
 * SubView of Medicine
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/ResearchMeds.html'
], function($, _, Backbone, tpl) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'researchMedsScreen',
        template: _.template(tpl),
        events: {

        },

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        }

    });
});



