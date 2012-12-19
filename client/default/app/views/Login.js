/**
 * @fileOverview: The Backbone view covering the login and loading pages of the
 * application, which cover the entire login process.
 */

define([
  'zepto',
  'underscore',
  'backbone',
  'feedhenry',
  'text!templates/login.html'
], function($, _, Backbone, $fh, loginTemplate) {

  return Backbone.View.extend({
    tagName: 'section',
    id: 'login',
    template: loginTemplate,

    // TODO: Look into the 'submit form' section.
    events: {
      'click #signin': 'login',
      'submit form': 'login'
    },

    initialize: function() {
      _.bindAll(this);
    },

    render: function() {
      this.$el.html(this.template);

      this.loadingSection = this.$('#loading-display').remove();

      // TODO: Remove this in production!
      this.$('#username').val('jsmith101');
      this.$('#password').val('12345');

      return this;
    },

    login: function() {
      var self = this;
      var username = $('#username').val();
      var password = $('#password').val();

      if (username && password) {

        // TODO: Merge this into using the new act mapping functionality.
        $fh.act({
          act: 'loginAction',
          req: {
            request: {
              payload: {
                login: {
                  userId: username,
                  password: password
                }
              }
            }
          }
        }, function(res) {
          console.log(res);
          // TODO: Implement login storage.
        }, function(msg, err) {
          console.log(msg, err);
          self.errorMsg(msg);
        });
      } else {
        Backbone.trigger('notify', 'Please fill in both fields...');
        return;
      }

      this.showLoading();
    },

    showLoading: function() {
      var self = this;

      var loginEl = this.$('#login-display');
      loginEl.addClass('hidden');

      // Give the animation time to complete...
      setTimeout(function() {
        self.loginSection = loginEl.remove();
        self.$('#login-box').addClass('loading');
        self.$('#login-box-center').html(self.loadingSection);

        // The animation won't be triggered unless we allow the DOM manipulation
        // to complete, so we must place this inside a zero timeout to allow the
        // call stack to complete.
        setTimeout(function() {
          self.loadingSection.removeClass('hidden');
        }, 0);
      }, 300);
    },

    errorMsg: function(msg) {
      var errorBox = $('<div class="errorBox"></div>');
      errorBox.append('<p class="error">'+ msg + '</p>');
      this.$el.append(errorBox);
    }
  });
});
