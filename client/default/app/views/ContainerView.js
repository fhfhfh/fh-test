/**
 * @fileOverview A base view for views which contain other views; because
 * sections can contain (multiple) sub-views, we need to ensure Backbone cleanly
 * removes these when a route triggers the removal of the main parent view.
 */


define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  return Backbone.View.extend({

    /**
     * Extends the underlying Backbone view _configure method; accepts and sets
     * up a subViews option for contained views, then calls the underlying
     * implementation to handle everything else as normal.
     *
     * options.subViews is expected to be an object containing instantiated view
     * objects, for example: { news: new NewsView() }
     *
     * @param {Object} options The options object which _configure expects.
     *
     * @private
     */
    _configure: function(options) {
      if (options && options.subViews) {
        this.subViews = this.subViews ?
            _.extend(this.subViews, options.subViews) :
            options.subViews;
      } else {
        this.subViews = this.subViews || {};
      }
      Backbone.View.prototype._configure.apply(this, arguments);
    },

    /**
     * Extends Backbone view's standard remove function by ensuring remove is
     * also called on any contained views.
     *
     * @return {Backbone.View} This ContainerView.
     */
    remove: function() {
      _.each(this.subViews, function(subView, key, subViews) {
        subView.remove();
        delete subViews[key];
      });
      return Backbone.View.prototype.remove.call(this);
    },

    /**
     * Sets the currently active child view of this ContainerView to the view
     * given as argument, if it exists. If it doesn't, will redirect to the 404
     * page.
     *
     * @param {string} view The name of the child view you wish to activate.
     *
     * @return {boolean} Whether or not the view was activated successfully.
     */
    setActiveView: function(view) {
      var self = this,
          previousView = this.activeView;

      if (this.subViews.hasOwnProperty(view)) {
        if (this.activeView === this.subViews[view]) {
          return true;
        }
        this.activeView = this.subViews[view];
        if (this.$nav) {
          this.$nav.find('a').each(function() {

            // TODO: Revisit use of href vs data-view for semantics.
            if ($(this).prop('data-view') === view) {
              $(this).addClass('current');
            } else {
              $(this).removeClass('current');
            }
          });
        }

        this.$content.html(this.activeView.render().el);
        if (previousView) {
          previousView.undelegateEvents();
        }

        this.activeView.delegateEvents();
        this.activeView.container = this;
        
        if (this.refreshScroll) {
          this.refreshScroll();
        } else if(this.container && this.container.refreshScroll){
          this.container.refreshScroll();
        }
        return true;
      } else {

        // TODO: Try to ensure this doesn't replace the URL in question.
        Backbone.history.navigate('404', {
          trigger: true,
          replace: true
        });
        return false;
      }
    },

    /**
     * Overrides Backbone.View's default delegateEvents to ensure that the
     * currently active views events are delegated as well.
     *
     * @param {Object} [events] The standard hash of events for delegateEvents.
     */
    delegateEvents: function(events) {
      if (!events && this.activeView) {
        this.activeView.delegateEvents();
      }
      Backbone.View.prototype.delegateEvents.apply(this, arguments);
    }
  });
});
