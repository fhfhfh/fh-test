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

		saveProfile 	: _saveProfile,
		validateInputs	: _validateInputs
	});


	//implementation-------------------------------
	var user = new User();

	function _saveProfile(view){
		var el = view.$el;
		var profile, details; // used to store the unchaged user info

		// all input values from view
		var inputs = {
			firstName	: $('#firstName').val(),
			middleName	: $('#middleName').val(),
			lastName	: $('#lastName').val(),
			sex			: $('#sex').val(),
			email		: $('#email').val(),
			birthday	: $('#birthday').val(),
			address		: $('div#address')[0].innerText || '',

			phone		: $('#phone').val(),
			mobile		: $('#mobile').val()
		};

		// call form validation function
		var valid = this.validateInputs(inputs);
		if(valid === true){
			// load user profile from localStorage before saving
			var prof = user.loadUser(function(res, data){
				if(res){
					var profile = data || {};
					profile.userDetails = inputs;
					// save profile to localStorage
					user.setProfile(profile);
					user.saveUser(function(res){
						Backbone.trigger('notify', 'Profile Saved!');
						// simulate user navigating back to Home screen
						$('#topBar #cancel').click(); 
					});
				} else {
					console.log('prof load fail');
				}
			});	
		} else {
			Backbone.trigger('notify', valid);
			return;
		}
	};

	/*
	 * Basic Form validation
	 * - check null values
	 * - check numeric values
	 */
	function _validateInputs(inputs) {
		var d = inputs;
		//check for null values
		for(var prop in d){
			if(d.hasOwnProperty(prop)){
				if(d[prop] == undefined || d[prop].length <1){
					if(prop != 'middleName' && prop != 'mobile'){
						console.log(prop, ': fail');
						return 'Please Fill in all fields';	
					}
					
				}
				else {
					console.log(prop, ': ok');
				}
			}
		}

		//check for null values
		// if(d.firstName.length <1 || d.middleName.length <1 || d.lastName.length <1 ||
		// 	d.email.length <1 || d.birthday.length <1 || d.address.length <1 || d.phone.length <1 || 
		// 	d.mobile.length <1){
		// 	return 'Please Fill in all fields';
		// } else if(isNaN(parseInt(d.mobile)) || isNaN(parseInt(d.phone))) {
		// 	return 'Check phone numbers only contain Numeric values';
		// } else {
		// 	// TODO: email validation
		// }

		return true;
	}
	

	return profile;

});
