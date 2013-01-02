/*--------------------
	app/views/Profile

	View for all user details
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'models/Acts',
        'models/User',
        'text!templates/pages/Profile.html',
        'controllers/Profile'
], function($, _, Backbone, Acts, User, template, Controller) {

	//interface ---------------------------
	var profile = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'profile',
	    el 		: $('#content'),
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
	var user		= new User();
	var controller	= new Controller();

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
			if(res){
				details = data.userDetails;
			}else{
				alert('TODO: error handling');
			}
		});

		return details;
	};

	function _saveDetails(){
		controller.saveProfile(this);
		console.log('Saving...');
	};

	function _cancel(){
		app.navigate('home', true);
	}



	return profile;

});