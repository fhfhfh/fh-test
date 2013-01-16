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
		validate 		: _validate
	});


	//implementation-------------------------------
	var user = new User();

	function _saveProfile(view){
		var el = view.$el;
		var profile, details; // used to store the unchaged user info
		console.log(el);
		// all input values from view
		var inputs = {
			firstName	: el.find('#firstName').val() || '',
			middleName	: el.find('#middleName').val() || '',
			lastName	: el.find('#lastName').val() || '',
			sex			: el.find('#sex').val() || '',
			email		: el.find('#email').val() || '',
			birthday	: el.find('#birthday').val() || '',
			address		: el.find('div#address').innerText || '',

			phone		: el.find('#phone').val() || '',
			mobile		: el.find('#mobile').val() || ''
		};

		var inputs2 = {
			firstName	: $('#firstName').val(),
			middleName	: $('#middleName').val(),
			lastName	: $('#lastName').val(),
			sex			: $('#sex').val(),
			email		: $('#email').val(),
			birthday	: $('#birthday').val(),
			address		: $('div#address')[0].value,

			phone		: $('#phone').val(),
			mobile		: $('#mobile').val()
		};

		console.log(inputs);
		console.log(inputs2);

		// call form validation function
		var valid = this.validate(inputs2);
		if(valid === true){
			// load user profile from localStorage before saving
			var prof = user.loadUser(function(res, data){
				if(res){
					profile = data;
					profile.userDetails = inputs;
					// save profile to localStorage
					user.setProfile(profile);
					user.saveUser(function(res){
						Backbone.trigger('notify', 'Profile Saved!');
					}); // no need for callback
				}
			});
			// TODO: save profile to user model and local storage	
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
	function _validate(inputs) {
		var d = inputs;
		console.log(d);
		//check for null values
		for(var prop in d){
			if(d.hasOwnProperty(prop)){
				if(d.prop == undefined || d.prop.length <1){
					console.log(d.prop, prop);
					return 'Please Fill in all fields';
				}
				else {
					return true;
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
