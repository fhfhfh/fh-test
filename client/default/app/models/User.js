/*--------------------
	app/models/User

	User model
--------------------*/
define(['zepto',
        'underscore',
        'backbone'
], function($, _, Backbone) {

	//interface----------------------------------
	Peachy.Models.User = Backbone.Model.extend({

		getSession : _getSession,
		setSession : _setSession,
		getName    : _getName,
		setName    : _setName,
		getProfile : _getProfile,
		setProfile : _setProfile
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

	return Peachy.Models.User;

});