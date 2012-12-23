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

      // If no message was given, we don't want to throw an unhandled error, nor
      // do we want notifications to stop working. For the meantime, just log a
      // stack trace and notify with default message.
      // TODO: Prevent notification from displaying at all in this case.
      if (!this.options.msg) {
        console.log(new Error('No message given to notify.'));
        this.options.msg = 'No message given...';
      }

      this.msg = this.options.msg;
    },

    render: function() {
      this.$el.html('<p>' + this.options.msg + '</p>');
      this.isVisible = true;
      return this;
    },

    closeNotification: function() {
      var self = this;
      this.$el.one('webkitTransitionEnd', function() {
        self.remove();
        Backbone.trigger('notify-remove', self);
      });
      this.$el.addClass('hidden');
    }
  });

  function NotificationManager(options) {
    var self = this;
    this.userClosedLast = false;
    this.queue = [];

    // The user can provide a custom Backbone.View to use, as well as a custom
    // element to use as the root.
    this.View = (options && options.view) || NotificationView;
    if (options && options.el) {
      this.View = this.View.extend({ el: options.el });
    }

    this.timeout = (options && options.timeout) || 4000;

    Backbone.on('notify', function(msg) {
      var newNotification = new self.View({
        msg: msg
      });
      self.queue.push(newNotification);
      self.showView(newNotification);
    });

    Backbone.on('notify-closed', function(notification) {
      self.userClosedLast = true;
    });
  }

  NotificationManager.prototype.showView = function(notification) {
    notification.showView
    this.$el.append(notification.render().el);
  };

  NotificationManager.prototype.closeView = function

  return NotificationManager;
});
