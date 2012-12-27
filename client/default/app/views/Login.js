/*--------------------
	app/views/Login

	Login page View
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/pages/Login.html',
        'controllers/Login',
        'views/Loading',
        'models/Notification'
], function($, _, Backbone, loginTemplate, LoginController, LoadingView, notifier) {

	//interface--------------------------------------
	var login = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'login',
	    template: loginTemplate,
	    el 		: $('#body'),
	    events	: {
			'click #signin': 'login',
			'submit form' : 'login'
	    },

		initialize	: _initialize,
		render		: _render,		// return login page
		login		: _login		// call login controller to validate inputs and login, and create Loading page
	});


	//implementation-------------------------------
	var controller = new LoginController();
	var user, password;
	var errorBox = $("<div/>").addClass("errorBox");


	function _initialize(){
		_.bindAll(this);
		this.render();

	};

	function _render(){
		this.$el.html(this.template);
		return this;
	};


	function _login(e){
		var self = this;
		var username = $('#username').val();
		var password = $('#password').val();
		var validated = controller.validate(username, password);

		if(validated){
			controller.login(username, password, function(res, msg){
				// Check for login success
				if(res === true){
					var loadingView = new LoadingView();
				}
				else {
					notifier.msg("Invalid Id/Password");
                                        notifier.msg(msg);
				}
			});
		} else {
			console.log('Fail');
			notifier.msg('Please fill in both fields');
		}
	};

	

	return login;

});