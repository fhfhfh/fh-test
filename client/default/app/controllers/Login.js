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
  
                            var i =Math.floor(Math.random()*3);
                            $('#loading-snippet #first').html(JSON.stringify(res.payload.quotes[i].quote));
                            $('#loading-snippet #second').html(JSON.stringify(res.payload.quotes[i].author));

                            // allow user time to read quote
                            setTimeout(function(){
                                return callback(res, session.attributes.video, session.attributes.newData);
                            }, 3000);                    
                        }
                        else {
                            $('#loading-snippet #first').html("Did you know a medium-size apple has 90 calories and 3&frac12; grams of dietary fiber?");
                            $('#loading-snippet #second').html("Maybe that's why they say “an apple-a-day keeps the doctor away.”");
                        }
                    });
                },

                error: function() {
                Backbone.trigger('notify', 'Error logging in.');
                return callback(false);
                }
            });
        };

        function _loggedIn(username, password){
            var self = this;
            user.setName(username);
            user.setPassword(password);
		
            user.setProfile(session.attributes.userProfile);
            user.saveUser(function(res){
            });
        };
	

        return login;

    });
