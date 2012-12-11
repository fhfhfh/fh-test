/*--------------------
	app/views/Profile

	View for all user details
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'models/Acts',
        'models/User',
        'text!templates/pages/Profile.html'
], function($, _, Backbone, Acts, User, template) {

	//interface ---------------------------
	var profile = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'profile',
	    el 		: $('body'),
	    template: _.template(template),
	    events  : {
	    	'click #save'	: 'saveDetails',
	    	'click #cancel'	: 'cancel'
	    },

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
		populate 	: _populate, 	// Populate all detail fields
		saveDetails : _saveDetails,	// Save details to user model
		cancel 		: _cancel		// navigate back to home page
	});


	//implementation-------------------------------
	var user = new User();

	function _initialize(){
		this.render();
	};

	function _render(){
		var self = this;
		var details = this.populate();
		this.$el.html(this.template(details));

		return this;
	};

	function _populate(){
		var details;

		user.loadUser(function(res, data){
			console.log(data);
			if(res){
				details = data.userDetails;
			}else{
				alert('TODO: error handling');
			}
		});

		return details;
	};

	function _saveDetails(){
		var profile

		// TODO: save profile to user model and local storage
		console.log('Saving...');
	};

	function _cancel(){
		App.navigate('home', true);
	}



	return profile;

});