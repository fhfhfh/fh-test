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

		saveProfile 	: _saveProfile
	});


	//implementation-------------------------------
	var user = new User();

	function _saveProfile(view){
		var el = view.$el;
		var profile, details; // used to store the unchaged user info

		// all input values from view
		var inputs = {
			address : el.find('#address').val()
		};


		var prof = user.loadUser(function(res, data){
			if(res){
				profile = data;
				details = profile.userDetails;
				// set new data
				details.address = addr;

				profile.userDetails = details;
				user.setProfile(profile);
				user.saveUser(function(res){}); // no need for callback
			}
		});

		// TODO: save profile to user model and local storage
	}
	

	return profile;

});