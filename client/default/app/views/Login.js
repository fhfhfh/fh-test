/*--------------------
	app/views/Login

	Login page View
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/login.tpl',
        'controllers/Login'
], function($, _, Backbone, loginTemplate) {


	Peachy.Views.Login = Backbone.View.extend({
		events : {
		'submit form' : 'login',
		'click #submit': 'login'
	},

		//interface----------------------------------
		// events		: _events,
		initialize	: _initialize,
		render		: _render,
		login		: _login,
		errorMsg 	: _errorMsg
	});
	
	//scripts------------------------------------


	//implementation-------------------------------
	// var self = this;
	var controller = new Peachy.Controllers.Login();
	var user, password;
	var errorBox = $("<div/>").addClass("errorBox");
	var _events = {
		'submit form' : 'login',
		'click #submit': 'login'
	};

	function _initialize(){
		this.render();
		this.login();
	};

	function _render(){
		var $el = $('body').html(loginTemplate);

		user = this.$('#name');
		password = this.$('#password');
		return $el;
	};


	function _login(){
		console.log(this);
		user = user.val();
		password = password.val();
		var validated = controller.validate(user, password);

		if(validated){
			controller.login(user, password);
		} else {
			this.errorMsg('Please fill in both fields');
		}
	};

	function _errorMsg(msg){
		var error = '<p class="error">'+ msg + '</p>';
		errorBox.append(error);
		this.$el.append(errorBox);
	}
	

	return Peachy.Views.Login;

});