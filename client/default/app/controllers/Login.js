/*--------------------
	app/controllers/Login

	Login page Controller
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'models/Acts',
        'models/User'
], function($, _, Backbone, Acts, User) {

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
				self.loggedIn(session, username);
				return callback(true);
				console.log(res);
			}, function(err, msg){
				console.log(err);
				return callback(err, msg);
			}
		);
	};

	function _loggedIn(session, username){
		user.setSession(session);
		user.setName(username);
		
		// Get user profile from cloud
		user.fetchUser(function(res){
			console.log(res);
		});
	};
	

	return login;

});