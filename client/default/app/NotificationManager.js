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

  var NotificationView = Backbone.View.extend({
    tagName: 'aside',
    className: 'notification hidden',
    isVisible: false,
    done: false,

    events: {
      'click': 'closeNotification'
    },

    initialize: function() {
      _.bindAll(this);
    },

    render: function() {
      this.$el.html('<p>' + this.options.msg + '</p>');
      this.isVisible = true;
      return this;
    },

    closeNotification: function() {
      var self = this;
      this.$el.addClass('hidden');
      setTimeout(function() {
        self.remove();
        self.done = true;
        Backbone.trigger('notify-remove');
      }, 200);
    }
  });

  function NotificationManager() {
    var self = this;

    this.notifications = [];
    this.queue = [];

    Backbone.on('notify', function(msg) {
      var notificationView = new NotificationView({
        msg: msg
      });
      self.queue.push(notificationView);
      self.handleQueue();
    });

    Backbone.on('notify-remove', function() {
      self.handleQueue.call(self);
    });
  }

  NotificationManager.prototype.handleQueue = _.debounce(function() {
    for (var i = 0, l = this.notifications.length; i < l; i++) {
      if (this.notifications[i] && this.notifications[i].done) {
        this.notifications.splice(i, 1);
      }
    }

    if (!(this.notifications.length >= 3)) {
      while (this.notifications.length < 3 && this.queue.length) {
        var nextNotification = this.queue.shift();
        this.notifications.push(nextNotification);
        this.show(nextNotification);
      }
    }
  }, 100);

  NotificationManager.prototype.show = function(notification) {
    $('#notifications').append(notification.render().el);

    setTimeout(function() {
      notification.$el.removeClass('hidden');
    }, 0);

    setTimeout(function() {
      notification.closeNotification();
    }, 4000);
  };

  return NotificationManager;
});
