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
        Backbone.trigger('notify-remove', self);
      }, 200);
    }
  });

  function NotificationManager() {
    var self = this;

    this.queue = [];

    Backbone.on('notify', function(msg) {
      var notificationView = new NotificationView({
        msg: msg
      });
      self.queue.push(notificationView);
      self.handleQueue();
    });

    Backbone.on('notify-remove', function(notificationView) {
      self.handleQueue.call(self, notificationView);
    });
  }

  NotificationManager.prototype.handleQueue = _.debounce(function(viewToGo) {
    if (viewToGo) {
      this.queue.splice(this.queue.indexOf(viewToGo), 1);
    }

    var l = (this.queue.length > 3) ? 3 : this.queue.length;
    for (var i = 0; i < l; i++) {
      if (this.queue[i] && !(this.queue[i].isVisible)) {
        console.log(i);
        this.showView(this.queue[i]);
      }
    }
  }, 100);

  NotificationManager.prototype.showView = function(notification) {
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
