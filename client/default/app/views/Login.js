/**
 * @fileOverview: The Backbone view covering the login and loading pages of the
 * application, which cover the entire login process.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'feedhenry',
    'text!templates/pages/Login.html',
    'controllers/Login',
    'views/WelcomeVideo',
    'models/quotes',
    'models/session'
    ], function($, _, Backbone, $fh, loginTpl, loginController, WelcomeView, Quotes, session) {

        return Backbone.View.extend({
            tagName: 'section',
            id: 'login',
            controller: new loginController(),

            // TODO: Look into the 'submit form' section.
            events: {
                'submit form': 'login',
                'click #login-help-button': 'loginHelp',
                'input input': 'toggleSigninButton',
                'change input': 'toggleSigninButton'
            },

            initialize: function() {
                _.bindAll(this);
            },

            render: function() {
                this.$el.html(loginTpl);

                // TODO: Remove this in production!
                this.$('#username').val('jsmith101');
                this.$('#password').val('12345');

                this.toggleSigninButton();

                return this;
            },

          /**
           * Ensures sign-in button is disabled until the user enters both a username
           * and a password.
           *
           * @param {boolean} [val] If provided, ignore inputs and set to this.
           */
          toggleSigninButton: function(val) {
            var $username = this.$('#username'),
                $password = this.$('#password'),
                $button = this.$('#signin');

            if (typeof val === 'boolean') {
              $button.prop('disabled', val);
            } else {
              if (!$username.val() || !$password.val()) {
                $button.prop('disabled', true);
              } else {
                $button.prop('disabled', false);
              }
            }
          },

            login: function() {
                var self = this;
                var username = $('#username').val();
                var password = $('#password').val();
                var quote = "";
                if (username && password) {
                    self.controller.login(username, password, function(url){
                        if(url === false){
                            Backbone.history.navigate('home', true, true);
                        }
                        else {
                            self.showVideo(url);
                        }
                    });

                  // session.login(username, password, {
                  //   success: function() {
                  //     Quotes.fetchQuotes(function(res, data){
                  //       if(res){
                  //         quote=res;
                  //         var i =Math.floor(Math.random()*3);
                  //         self.$('#loading-display #loading-snippet #first').html(JSON.stringify(res.payload.quotes[i].quote));
                  //         self.$('#loading-display #second').html(JSON.stringify(res.payload.quotes[i].author));

                  //       }
                  //     });

                  //     // TODO: Show properly based on property.
                  //     setTimeout(function(){
                  //       var welcome = new WelcomeView();
                  //       $('#content').html(welcome.render().el);
                  //       welcome.loadVideo('"http://www.youtube.com/embed/xqkBW1NCRLQ"');
                  //     }, 3000);
                  //   },

                  //   error: function() {
                  //     Backbone.trigger('notify', 'Error logging in.');
                  //     self.showLogin();
                  //   }
                  // });
                } else {
                    Backbone.trigger('notify', 'Please fill in both fields...');
                    return;
                }
                this.showLoading();
            },

            showVideo: function(url){
                var welcome = new WelcomeView();
                $('#content').html(welcome.render().el);
                welcome.loadVideo(url);
            },

          showLoading: function() {
            this.toggleSigninButton(true);
            this.$('#login-container').removeClass('visible');
            this.$('#loading-container').addClass('visible');
          },

          showLogin: function() {
            this.toggleSigninButton();
            this.$('#login-container').addClass('visible');
            this.$('#loading-container').removeClass('visible');
          },

            loginHelp: function() {
                Backbone.trigger('notify', 'Coming soon...');
            }
        });
    });
