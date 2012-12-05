/*--------------------
	app/controllers/Login

	Login page Controller
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
], function($, _, Backbone, loginTemplate) {


	Peachy.Controllers.Login = Backbone.Model.extend({

		//interface----------------------------------
		login		: _login
	});
	
	//scripts------------------------------------


	//implementation-------------------------------

	function _login(){
		// $.getJSON('/todo', function(data) 
		alert('HELLO');
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