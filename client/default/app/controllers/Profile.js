/*--------------------
	app/controllers/Profile

	Profile page Controller
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'models/Acts',
        'models/User'
], function($, _, Backbone, Acts, User) {

	//interface----------------------------------
	var profile = Backbone.Model.extend({

		saveProfile 	: _saveProfile,
		loadProfile 	: _loadProfile
	});


	//implementation-------------------------------
	var user = new User();

	function _saveProfile(view, callback){
		var el = view.$el;
		var profile, details; // used to store the unchaged user info

		// all input values from view
		var inputs = {
			firstName	: el.find('#firstName').val(),
			middleName	: el.find('#middleName').val(),
			lastName	: el.find('#lastName').val(),
			sex			: el.find('#sex').val(),
			email		: el.find('#email').val(),
			birthday	: el.find('#birthday').val(),
			address		: el.find('#address').val(),

			phone		: el.find('#phone').val(),
			mobile		: el.find('#mobile').val()
		};

		var prof = user.loadUser(function(res, data){
			if(res){
				profile = data || {};
				profile.userDetails = inputs;
				
				user.setProfile(profile);
				user.saveUser(function(res){
					if(res){
						return callback(true);
					} else {
						return callback(false);
					}
				}); 
			}
		});

		// TODO: save profile to user model and local storage
	};

	function _loadProfile(view){
		var el = view.$el;
		var profile;

		user.loadUser(function(res, data){
			if(res){
				if(data && data !=null){
					console.log("---------------------------"+JSON.stringify(data));
					profile = data.userDetails || {};
				}
			}
		});
                console.log("---------------------------"+JSON.stringify(profile));
		if(profile){
			el.find('#firstName').val(profile.firstName);
			el.find('#middleName').val(profile.middleName);
			el.find('#lastName').val(profile.lastName);
			el.find('#sex option[value='+profile.sex+']').attr('selected', 'selected');
			el.find('#email').val(profile.email);
			el.find('#birthday').val(profile.birthday);
			el.find('#address').val(profile.address);
			el.find('#phone').val(profile.phone);
			el.find('#mobile').val(profile.mobile);
		}

	}
	

	return profile;

});