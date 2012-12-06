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
		setName    : _setName
	});
	
	//scripts------------------------------------


	//implementation-------------------------------
	var session;
	var name;

	function getSession(){
		return session;
	};

	function setSession(sess){
		session = sess;
	};

	function getName(){
		return name;
	};

	function setName(user){
		name = user;
	};

	return Peachy.Models.User;

});