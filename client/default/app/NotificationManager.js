/**
 * @fileOverview The NotificationManager is a decoupled notification module
 * which listens for notify events and takes care of adding and removing the
 * notifications.
 */


// TODO: Clean up and complete.

define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var DefaultView = Backbone.View.extend({
    tagName: 'div',
    className: 'notification',
    id: 'notification',

    events: {
      'click li': 'close'
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
      this.$el.html('<h2>' +this.options.title+'</h2><p>' + this.options.msg + '</p><li class="btn action">OK</li>');
      return this;
    },

    close: function() {
      var self = this;
      $(this.$el).fadeOut(300, function(){
        self.remove();
        $('#modalMask').hide();
      });
      
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
      this.$el = $('#notifications');
    }

    this.timeout = (options && options.timeout) || 4000;

    Backbone.on('notify', function(msg, title) {
      var title = title || 'Alert';
      var newNotification = new self.View({
        msg: msg,
        title: title
      });
      self.queue.push(newNotification);
      self.showView(newNotification);
    });

    Backbone.on('notify:close', function(notification) {
      self.queue.shift();
      if (self.queue.length) {
        self.showView(self.queue[0]);
      }
    });
  }

  NotificationManager.prototype.showView = function(notification) {
    var self = this;

    if (!this.queue[0].isVisible) {
      this.$el.append(notification.render().el);
      setTimeout(function() {
        // notification.close();
      }, this.timeout);
      $('#modalMask').show();
    }
  };

  return NotificationManager;
});
