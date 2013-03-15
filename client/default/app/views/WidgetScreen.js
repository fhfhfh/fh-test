/**
 * @fileOverview The 404 Error view of the Peachy app.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pages/Foodometer.html',
], function($, _, Backbone, tpl) {
  return Backbone.View.extend({
    tagName: 'section',
    id: 'widgetScreen',
    template: _.template(tpl),

    initialize: function() {
      _.bindAll(this);
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
});
