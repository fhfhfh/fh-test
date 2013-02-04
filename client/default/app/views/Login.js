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
    'models/session'
    ], function($, _, Backbone, $fh, loginTpl, loginController, WelcomeView, session) {

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
                    self.controller.login(username, password, function(res,url,newData){
                        if(res === false){
                            self.showLogin();
                        }
                        else if(url != null) {
                            self.showVideo(url, newData);
                        }
                        else if(newData == '1'){
                            // call home view first to initialise main app navigation
                            Backbone.history.navigate('home', true, true);
                            Backbone.history.navigate('profile', true, true);
                        }
                        else {
                            Backbone.history.navigate('home', true, true);
                        }
                    });

                } else {
                    Backbone.trigger('notify', 'Please fill in both fields...');
                    return;
                }
                this.showLoading();
            },

            showVideo: function(url, newData){
                var welcome = new WelcomeView();
                $('#content').html(welcome.render().el);
                welcome.newData = newData;
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
