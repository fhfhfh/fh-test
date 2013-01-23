/*--------------------
	app/controllers/Login

	Login page Controller
--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'models/Acts',
    'models/User',
    'hash'
    ], function($, _, Backbone, Acts, User, hash) {

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

            // Call login cloud function
            Acts.call('loginAction', params, 
                function(res){
                    var session = res.head.sessionId;
                    self.loggedIn(session, username, password);
                    res.video = true;
                    return callback(true, res);
                    console.log(res);
                }, function(err, msg){
                    console.log(err, msg);
                    err.video = true;
                    return callback(err, msg);
                }
                );
        };

        function _loggedIn(session, username, password){
            var self = this;
            user.setSession(session);

            localStorage.setItem('peachy_session', session);
            user.setName(username);
            user.setPassword(password);
		
            // Get user profile from cloud
            user.fetchUser(function(res){
                console.log(res);
            });
        };
	

        return login;

    });
