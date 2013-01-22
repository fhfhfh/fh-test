/*--------------------
	app/controllers/Logout

	Logout page Controller
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'models/Acts',
        'models/User'
], function($, _, Backbone, Acts, User) {

	//interface----------------------------------
	var logout = Backbone.Model.extend({

		logout		: _logout
	});
	
	//scripts------------------------------------


	//implementation-------------------------------
	function _logout(){
		var params = "";
                // Call logout cloud function
		Acts.call('logoutAction', params, 
			function(res){
				var session = res.head.sessionId;
				self.loggedIn(session, username);
				return callback(true);
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
	

	return logout;

});