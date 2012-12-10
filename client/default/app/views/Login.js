/*--------------------
	app/views/Login

	Login page View
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/pages/Login.html',
        'controllers/Login',
        'views/Loading'
], function($, _, Backbone, loginTemplate, LoginController, LoadingView) {

	//interface--------------------------------------
	var login = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'login',
	    template: loginTemplate,
	    el 		: $('body'),
	    events	: {
			'click #signin': 'login',
			'submit form' : 'login'
	    },

		initialize	: _initialize,
		render		: _render,		// return login page
		login		: _login,		// call login controller to validate inputs and login, and create Loading page
		errorMsg 	: _errorMsg		// display error message to screen
	});


	//implementation-------------------------------
	var controller = new LoginController();
	var user, password;
	var errorBox = $("<div/>").addClass("errorBox");


	function _initialize(){
		_.bindAll(this);
		this.render();
		this.login();
	};

	function _render(){
		this.$el.html(this.template);

		// TEST CODE -- dummy login
		this.$('#username').val('demo');
		this.$('#password').val('demo');
		//------------------------

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
					self.errorMsg(msg);
				}
			});
		} else {
			console.log('Fail');
			this.errorMsg('Please fill in both fields');
		}
	};

	function _errorMsg(msg){
		var error = '<p class="error">'+ msg + '</p>';
		errorBox.append(error);
		this.$el.append(errorBox);
	}
	

	return login;

});