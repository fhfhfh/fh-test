/**
 * @fileOverview: The Backbone view covering the login and loading pages of the
 * application, which cover the entire login process.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'feedhenry',
  'text!templates/login.html',
  'text!templates/login-loading.html',
  'controllers/Login'
], function($, _, Backbone, $fh, loginTpl, loadingTpl, loginController) {

  return Backbone.View.extend({
    tagName: 'section',
    id: 'login',
    controller: new loginController(),

    // TODO: Look into the 'submit form' section.
    events: {
      'submit form': 'login',
      'click #login-help-button': 'loginHelp'
    },

    initialize: function() {
      _.bindAll(this);
    },

    render: function() {
      this.$el.html(loginTpl);

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

        self.controller.login(username, password, function(res){
          if(res){
            app.navigate('home', true, true);
          }
        });

        // TODO: Merge this into using the new act mapping functionality.
        // $fh.act({
        //   act: 'loginAction',
        //   req: {
        //     request: {
        //       payload: {
        //         login: {
        //           userId: username,
        //           password: password
        //         }
        //       }
        //     }
        //   }
        // }, function(res) {
        //   console.log(res);
        //   // TODO: Implement login storage.
        // }, function(msg, err) {
        //   console.log(msg, err);

        //   // TODO: Get Mindstix to return a proper Error object to callback!
        //   var errMsg = JSON.parse(err.error).response.payload.status.msg;

        //   Backbone.trigger('notify', errMsg);
        //   self.showLogin();
        // });
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
        self.loginEl = loginEl.remove();
        self.$('#login-box').addClass('loading');
        self.$('#login-box-center').html(loadingTpl);

        // The animation won't be triggered unless we allow the DOM manipulation
        // to complete, so we must place this inside a zero timeout to allow the
        // call stack to complete.
        setTimeout(function() {
          self.$('#loading-display').removeClass('hidden');
        }, 0);
      }, 300);
    },

    showLogin: function() {
      var self = this;

      var loadingEl = this.$('#loading-display');
      loadingEl.addClass('hidden');

      // Give the animation time to complete...
      setTimeout(function() {
        loadingEl.remove();
        self.$('#login-box').removeClass('loading');
        self.$('#login-box-center').html(self.loginEl);

        // The animation won't be triggered unless we allow the DOM manipulation
        // to complete, so we must place this inside a zero timeout to allow the
        // call stack to complete.
        setTimeout(function() {
          self.$('#login-display').removeClass('hidden');
        }, 0);
      }, 300);
    },

    loginHelp: function() {
      Backbone.trigger('notify', 'Coming soon...');
    }
  });
});
