/**
 * @fileOverview The 404 Error view of the Peachy app.
 */


// TODO: Complete 404 page; this is a stub.

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
  return Backbone.View.extend({
    tagName: 'section',
    id: '404',

    initialize: function() {
      _.bindAll(this);
    },

    render: function() {
      this.$el.html($('<h1>404 - Page Not Found</h1>'));
      return this;
    }
  });
});
