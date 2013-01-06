/**
 * @fileOverview A base view for views which contain other views; because
 * sections can contain (multiple) sub-views, we need to ensure Backbone cleanly
 * removes these when a route triggers the removal of the main parent view.
 */


define(['underscore', 'backbone'], function(_, Backbone) {
  return Backbone.View.extend({

    _configure: function(options) {
      if (options &&
          options.subViews &&
          _.isArray(options.subViews) &&
          options.subViews.length) {
        this.subViews = options.subViews;
      }
      return Backbone.View.prototype._configure.apply(this, arguments);
    },

    remove: function() {
      if (this.subViews && this.subViews.length) {
        while (this.subViews.length) {
          this.subViews.pop().remove();
        }
      }
      return Backbone.View.prototype.remove.apply(this);
    }
  });
});
