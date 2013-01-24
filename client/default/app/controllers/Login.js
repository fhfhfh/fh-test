/*--------------------
	app/controllers/Login

	Login page Controller
--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'models/Acts',
    'models/User',
    'hash',
    'models/session',
    'models/quotes'
    ], function($, _, Backbone, Acts, User, hash, session, Quotes) {

        //interface----------------------------------
        var login = Backbone.Model.extend({

            login		: _login,
            validate 	: _validate,
            loggedIn 	: _loggedIn
        });
	
        //scripts------------------------------------


        //implementation-------------------------------
        var user = new User();

        function _validate(username, pw){
            if(username != undefined && username != '' && pw != undefined && pw != ''){
                return true;
            } else {
                return false;
            }
        }

        function _login(username, password, callback){
            var self = this;
            var params = {
                'userId'	: username,
                'password'	: password
            };

            session.login(username, password, {
                success: function() {
                    self.loggedIn(username, password);
                    Quotes.fetchQuotes(function(res, data){
                        if(res){
                            quote=res;
                            var i =Math.floor(Math.random()*3);
                            $('#loading-display #loading-snippet #first').html(JSON.stringify(res.payload.quotes[i].quote));
                            $('#loading-display #second').html(JSON.stringify(res.payload.quotes[i].author));
                            return callback(true);
                        }
                    });
                },

                error: function() {
                Backbone.trigger('notify', 'Error logging in.');
                self.showLogin();
                }
            });
        };

        function _loggedIn(username, password){
            var self = this;
            user.setName(username);
            user.setPassword(password);
		
            // Get user profile from cloud
            user.fetchUser(function(res){
                console.log(res);
            });
        };
	

        return login;

    });
