/*--------------------
	app/controllers/Profile

	Profile page Controller
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'models/Acts',
        'models/User',
        'hash'
], function($, _, Backbone, Acts, User, hash) {

	//interface----------------------------------
	var profile = Backbone.Model.extend({

		saveProfile		: _saveProfile,
		validateInputs	: _validateInputs
	});


	//implementation-------------------------------
	var user = new User();

	function _saveProfile(view){
		var el = view.$el;
		var profile, details; // used to store the unchaged user info

		// break address box into individual variables
		var home = $('div#address')[0].innerText || '';
		home = home.split('\n');

		var address1;
		var address2;
		var zip;
		var state;

		if(home.length == 3){
			address1	= home[0] || '';
			state		= home[1] || '';
			zip			= home[2] || '';
		}
		else {
			address1	= home[0] || '';
			address2	= home[1] || '';
			state		= home[2] || '';
			zip			= home[3] || '';
		}


		// all input values from view
		var inputs = {
			firstName	: $('#firstName').val(),
			middleName	: $('#middleName').val(),
			lastName	: $('#lastName').val(),
			sex			: $('#sex').val(),
			email		: $('#email').val(),
			dob		: $('#birthday').val(),
			address1	: address1,
			address2	: address2,
			zip			: zip,
			state		: state,
			phone		: $('#phone').val(),
			mobile		: $('#mobile').val(),
			avatarId	: $('#profile-avatar').attr('imgId'),
			// last check before saving profile
			username	: $('#username').val(),
			password	: $('#password').val()
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
						user.saveUserOnline(function(res){
							if(res){
								// simulate user navigating back to Home screen
								$('#topBar #cancel').click();
							}
						});

					});
				} else {
					console.log('prof load fail');
				}
			});
		} else {
			Backbone.trigger('notify', valid, 'Validation Error');
			return;
		}
	}

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
				if(prop === 'password') {
					// console.log(d[prop]);
					// console.log(user);
					// var hashPassword	= d[prop].hashCode();
					// var currentPassword	= user.getPassword();
					// console.log(hashPassword, currentPassword);
					// if(hashPassword != currentPassword){
					//	// return 'Incorrect Password';
					// }
				}
				else if(prop === 'phone'){
					d[prop] = d[prop].replace(/\./g, '');
					if(d[prop].length != 10 || isNaN(d[prop])){
						return 'Please enter a valid Home Phone number (10 digits)';
					}
				}
				else if(prop === 'mobile'){
					if(isNaN(d[prop]) && d[prop].length > 0){
						return 'Please enter a valid Mobile Phone number';
					}
				}
				else if(prop === 'email'){
					if(d[prop].indexOf('@') == -1 || d[prop].indexOf('.') == -1){
						return 'Please enter a valid email address';
					}
				}

				if(d[prop] === undefined || d[prop].length <1){
//					if(prop === 'password'){
//						return 'Please enter your password to make profile changes';
//					}
					if(prop === 'middleName' || prop === 'mobile' || prop === 'address2'){
						console.log(prop, ': not required');
					}
					else {
//						console.log(prop, ': fail');
//						return 'Please Fill in all fields (' +prop+')';	
					}
				}
			}
		}

		return true;
	}


	return profile;

});
