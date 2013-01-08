/*--------------------
	app/models/User

	User model
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
       // 'models/Store',
        'models/Acts'
], function($, _, Backbone, Acts) {

	//interface----------------------------------
	var user = Backbone.Model.extend({
		//Backbone specific attributes
		session : null,
		name 	: null,
		profile : null,

		getSession : _getSession,	// get user sessionId from local storage
		setSession : _setSession,
		getName    : _getName,		// get Username
		setName    : _setName,
		getProfile : _getProfile,	// get all profile info
		setProfile : _setProfile,
		saveUser   : _saveUser,		// save user profile info to local storage
		loadUser   : _loadUser,
		fetchUser  : _fetchUser
	});
	
	//scripts------------------------------------


	//implementation-------------------------------

	function _getSession(){
		var self = this;

		if(this.session){
			return this.session;
		}
		else{
//			store.load('SessionID', function(res, data){
//				console.log(res, data.val);
//				session = data.val || self.session;
//				if(res){
//					return session;
//				}else {
//					return null;
//				}
//			});
		}
	};

	function _setSession(sess){
		this.session = sess;
		// store.save('SessionID', sess, function(){});// no need for callback function here
	};

	function _getName(){
		return this.name;
	};

	function _setName(username){
		this.name = username;
	};

	function _getProfile(){
		return this.profile;
	};

	function _setProfile(prof){
		this.profile = prof;
	};

	function _saveUser(callback){
		var prof =this.getProfile();
		prof = JSON.stringify(prof);

//		store.save('userProfile', prof, function(res){
//			if(res){
//				return callback(true);
//			}
//			else {
//				return callback(false);
//			}
//		});
	};

	function _loadUser(callback){
		var self = this;
//		store.load('userProfile', function(res, data){
//			var obj = JSON.parse(data.val);
//			console.log(obj);
//			if(res){
//				self.setProfile(obj);
//				return callback(res, obj);
//			}
//			else {
//				return callback(false);
//			}
//		});
	};

	function _fetchUser(callback){
		var self = this;
		// fetch user profile from cloud
		Acts.call('userProfileAction', {}, 
    		function(res){
    			self.setProfile(res.payload);
    			self.saveUser(function(res){
    				console.log('Saved User: ',res);
    				return callback(true);
    			});
    		}
		);
	};

	return user;

});
