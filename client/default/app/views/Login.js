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
    'text!templates/pages/Loading.html',
    'controllers/Login',
    'views/WelcomeVideo',
    'models/quotes',
    'models/session'
    ], function($, _, Backbone, $fh, loginTpl, loadingTpl, loginController, WelcomeView, Quotes, session) {

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
     */
            toggleSigninButton: function() {

                // TODO: Cache selectors (carefully ensuring presence in the DOM).

                if (!$('#username').val() || !$('#password').val()) {
                    $('#signin').prop('disabled', true);
                } else {
                    $('#signin').prop('disabled', false);
                }
            },
            login: function() {
                var self = this;
                var username = $('#username').val();
                var password = $('#password').val();
                var quote = "";
                if (username && password) {
                    self.controller.login(username, password, function(url){
                        self.showVideo(url);
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
                welcome.loadVideo('"http://www.youtube.com/embed/xqkBW1NCRLQ"');
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
