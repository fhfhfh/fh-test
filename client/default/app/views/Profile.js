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
        'controllers/Profile',
        'models/Notification'
], function($, _, Backbone, Acts, User, template, Controller, notifier) {

	//interface ---------------------------
	var profile = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'profile',
	    el 		: $('#body'),
	    template: _.template(template),
	    events  : {
	    	'click #save'	: 'saveDetails',
	    	'click #cancel'	: 'cancel'
	    },

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
		saveDetails : _saveDetails,	// Save details to user model
		loadDetails : _loadDetails,
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
		this.$el.html(this.template());
		this.loadDetails();

		return this;
	};

	function _loadDetails(){
		controller.loadProfile(this);
	}

	function _saveDetails(){
		controller.saveProfile(this, function(res){
			if(res){
				notifier.msg('Details Saved Successfully!');
                                App.navigate('home', true);
			}
		});
	};

	function _cancel(){
		App.navigate('home', true);
	}



	return profile;

});