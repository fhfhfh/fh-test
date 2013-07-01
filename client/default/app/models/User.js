/*--------------------
	app/models/User

	User model
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
		'models/Store',
        'models/Acts'
], function($, _, Backbone, store, Acts) {

	//interface----------------------------------
	var user = Backbone.Model.extend({
		//Backbone specific attributes
		session : null,
		name	: null,
		pword	: null,
		profile : null,

		getSession		: _getSession,	// get user sessionId from local storage
		setSession		: _setSession,
		getName			: _getName,		// get Username
		setName			: _setName,
		getPassword		: _getPassword,	// get Username
		setPassword		: _setPassword,
		getProfile		: _getProfile,	// get all profile info
		setProfile		: _setProfile,
		saveUser		: _saveUser,	// save user profile info to local storage
		loadUser		: _loadUser,
		fetchUser		: _fetchUser,
		saveUserOnline	: _saveUserOnline
	});




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
	}

	function _setSession(sess){
		this.session = sess;

		avatar_id = "";
		store.save('SessionID', sess, function(){});// no need for callback function here
	}

	function _getName(){
		var self = this;
		store.load('Peachy_username',function(res, data){
			if(res){
				self.setName(data);
				return data;
			}
			else {
				return self.name;
			}
		});
	}

	function _setName(username){
		this.name = username;
		store.save('Peachy_username', username, function(){});
	}



	function _getPassword(){
		var self = this;
		store.load('Peachy_hashpword',function(res, data){
			if(res){
				self.setPassword(data);
				return data;
			}
			else {
				return self.pword;
			}
		});
	}

	function _setPassword(password){
		this.pword = password;
		var hash = password.hashCode();

		store.save('Peachy_hashpword', hash, function(){});
	}


	function _getProfile(){
		return this.profile;
	}

	function _setProfile(prof){
		this.profile = prof;
	}

	function _saveUser(callback){
		var prof =this.getProfile();
		var self = this;
		prof = JSON.stringify(prof);

		store.save('userProfile', prof, function(res){
			if(res){
				// self.saveUserOnline();
				return callback(true);
			}
			else {
				return callback(false);
			}
		});
	}

	function _loadUser(callback){
		var self = this;
		store.load('userProfile', function(res, data){
			var obj = JSON.parse(data);
			if(res && obj){
				obj.userDetails.username =  self.name ||self.getName();
				self.setProfile(obj);
				return callback(res, obj);
			}
			else {
				return callback(false);
			}
		});
	}

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
			},
			function(err, msg){
				console.log('Failed to get Profile', msg);
				return callback(false);
			}
		);
	}

	function _saveUserOnline(callback){
                var prof = this.profile;
                Acts.call('saveUserProfileAction', prof,
			function(res){
				callback(true);
				Backbone.trigger('notify', 'Profile Saved to Cloud');
			},
            function(err, msg){
                callback(false);
                console.log(msg, err);
				Backbone.trigger('notify', 'Failed to Save Profile to Cloud', 'Error: ' +err);
            }
		);
	}

	return user;

});
