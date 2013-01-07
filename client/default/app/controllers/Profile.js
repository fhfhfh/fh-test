/*--------------------
	app/controllers/Profile

	Profile page Controller
--------------------*/
define(['jquery',
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

		console.log(inputs);

		var prof = user.loadUser(function(res, data){
			if(res){
				profile = data;
				profile.userDetails = inputs;
				
				user.setProfile(profile);
				user.saveUser(function(res){}); // no need for callback
			}
		});

		// TODO: save profile to user model and local storage
	}
	

	return profile;

});
