/*--------------------
	app/views/Login

	Login page View
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/pages/Login.tpl',
        'controllers/Login'
], function($, _, Backbone, loginTemplate) {


	Peachy.Views.Login = Backbone.View.extend({

		//interface----------------------------------
		initialize	: _initialize,
		render		: _render,
		login		: _login,
		errorMsg 	: _errorMsg,
		events		: {
			'submit form' : 'login',
			'click #submit': 'login'
		},
	});
	
	//scripts------------------------------------


	//implementation-------------------------------
	var controller = new Peachy.Controllers.Login();
	var user, password;
	var errorBox = $("<div/>").addClass("errorBox");


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