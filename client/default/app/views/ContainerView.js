/**
 * @fileOverview A base view for views which contain other views; because
 * sections can contain (multiple) sub-views, we need to ensure Backbone cleanly
 * removes these when a route triggers the removal of the main parent view.
 */


define(['underscore', 'backbone'], function(_, Backbone) {
  return Backbone.View.extend({

    _configure: function(options) {
      if (options && options.subViews) {
        this.subViews = this.subViews ?
            _.extend(this.subViews, options.subViews) :
            options.subViews;
      } else {
        this.subViews = this.subViews || {};
      }
      return Backbone.View.prototype._configure.apply(this, arguments);
    },

    remove: function() {
      _.each(this.subViews, function(subView, key, subViews) {
        subView.remove();
        delete subViews[key];
      });
      return Backbone.View.prototype.remove.call(this);
    },

    setActiveView: function(view) {
      var self = this;
      if (view in this.subViews) {
        this.activeView = this.subViews[view];
        if (this.$nav) {
          this.$nav.find('a').each(function() {
            if ($(this).prop('data-view') === view) {
              $(this).addClass('current');
            } else {
              $(this).removeClass('current');
            }
          });
        }
        this.$content.html(this.activeView.render().el);
        // this.assign(this.activeView, self.$content);

        this.activeView.delegateEvents();
        if (this.refreshScroll) {
          this.refreshScroll();
        }
        return this;
      } else {

        // TODO: Try to ensure this doesn't replace the URL in question.
        Backbone.history.navigate('404', {
          trigger: false,
          replace: false
        });
        return false;
      }
    },

    assign : function (view, selector) {
      view.setElement(this.$(selector)).render().el;
  }
  });
});
