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

		saveProfile 	: _saveProfile,
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
		var address1	= home[0] || '';
		var address2	= home[1] || '';
		var zip			= home[2] || '';
		var state		= home[3] || '';

		// all input values from view
		var inputs = {
			firstName	: $('#firstName').val(),
			middleName	: $('#middleName').val(),
			lastName	: $('#lastName').val(),
			sex			: $('#sex').val(),
			email		: $('#email').val(),
			dob 		: $('#birthday').val(),
			address1	: address1,
			address2	: address2,
			zip 		: zip,
			state 		: state,
			phone		: $('#phone').val(),
			mobile		: $('#mobile').val(),
			// last check before saving profile
			username	: $('#username').val(),
			password	: $('#password').val(),
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
					if(prop === 'password'){
						return 'Please enter your password to make profile changes';
					}
					else if(prop === 'middleName' || prop === 'mobile'){
						console.log(prop, ': not required');	
					}
					else {
						console.log(prop, ': fail');
						return 'Please Fill in all fields (' +prop+')';	
					}
					
				}
				else if(prop === 'password') {
					console.log(d[prop]);
					console.log(user);
					var hashPassword	= d[prop].hashCode();
					var currentPassword	= user.getPassword();
					console.log(hashPassword, currentPassword);
					if(hashPassword != currentPassword){
						return 'Incorrect Password';
					}
				}
				else if(prop === 'phone' && isNaN(d[prop])){
					return 'Please enter a valid number for Home Phone';
				}
			}
		}

		return true;
	}
	

	return profile;

});
