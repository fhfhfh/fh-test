/**
 * @fileOverview The NotificationManager is a decoupled notification module
 * which listens for notify events and takes care of adding and removing the
 * notifications.
 */


// TODO: Clean up and complete.

define([
  'zepto',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var DefaultView = Backbone.View.extend({
    tagName: 'aside',
    className: 'notification',

    events: {
      'click': 'closeNotification'
    },

    initialize: function() {
      _.bindAll(this);

      if (!this.options.msg) {
        this.close();
      } else {
        this.msg = this.options.msg;
      }
    },

    render: function() {
      this.$el.html('<p>' + this.options.msg + '</p>');
      return this;
    },

    close: function() {
      this.remove();
      Backbone.trigger('notify:close', this);
    }
  });

  function NotificationManager(options) {
    var self = this;
    this.queue = [];

    // The user can provide a custom Backbone.View to use, as well as a custom
    // element to use as the root.
    this.View = (options && options.view) || DefaultView;
    if (options && options.el) {
      if (options.el instanceof Node) {
        this.$el = $(options.el);
      } else if (options.el instanceof $.fn.constructor) {
        this.$el = options.el;
      } else {
        this.$el = $(options.el);
      }
    }

    if (!this.$el || !this.$el.length) {
      this.$el = $(document.body);
    }

    this.timeout = (options && options.timeout) || 4000;

    Backbone.on('notify', function(msg) {
      var newNotification = new self.View({
        msg: msg
      });
      self.queue.push(newNotification);
      self.showView(newNotification);
    });

    Backbone.on('notify:close', function(notification) {
      self.queue.shift();
      if (self.queue.length) {
        self.showView(queue[0]);
      }
    });
  }

  NotificationManager.prototype.showView = function(notification) {
    var self = this;

    if (!this.queue[0].isVisible) {
      this.$el.append(notification.render().el);
      setTimeout(function() {
        notification.close();
      }, this.timeout);
    }
  };

  return NotificationManager;
});
