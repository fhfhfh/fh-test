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

		//interface----------------------------------
		events		: _events,
		initialize	: _initialize,
		render		: _render,
		login		: _login
	});
	
	//scripts------------------------------------


	//implementation-------------------------------
	var controller = new Peachy.Controllers.Login();
	var _events = {
		'submit form' : 'login'
	};

	function _initialize(){
		this.render();
	};

	function _render(){
		var $el = $('body').html(loginTemplate);
		return $el;
	};


	function _login(){
		var user, password;
		var validated = controller.validate(user,password);

		if(validated){
			controller.login(user,password);
		} else {
			alert('Failed', validated);
		}
	};
	

	return Peachy.Views.Login;

});