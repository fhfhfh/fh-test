/*--------------------
	app/models/User

	User model
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'models/Store'
], function($, _, Backbone, store) {

	//interface----------------------------------
	var user = Backbone.Model.extend({

		url : "Peachy/User",

		getSession : _getSession,
		setSession : _setSession,
		getName    : _getName,
		setName    : _setName,
		getProfile : _getProfile,
		setProfile : _setProfile,
		saveUser   : _saveUser,
		loadUser   : _loadUser
	});
	
	//scripts------------------------------------


	//implementation-------------------------------
	var session;
	var name;
	var profile = {};

	function _getSession(){
		return session;
	};

	function _setSession(sess){
		session = sess;
	};

	function _getName(){
		return name;
	};

	function _setName(username){
		name = username;
	};

	function _getProfile(){
		return profile;
	};

	function _setProfile(prof){
		profile = prof;
	};

	function _saveUser(callback){
		var prof =this.getProfile();
		prof = JSON.stringify(prof);

		store.save('userProfile', prof, function(res){
			if(res){
				return callback(true);
			}
			else {
				return callback(false);
			}
		});
	};

	function _loadUser(callback){
		store.load('userProfile', function(res, data){
			var obj = JSON.parse(data);
			if(res){
				return callback(res, obj);
			}
			else {
				return callback(false);
			}
		});
	};



	return user;

});