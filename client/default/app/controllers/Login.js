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
		login		: _login,
		validate 	: _validate
	});
	
	//scripts------------------------------------


	//implementation-------------------------------

	function _validate(user, pw){
		if(user != undefined && user != '' && pw != undefined && pw != ''){
			return true;
		} else {
			return false;
		}
	}

	function _login(user, password){
		// $.getJSON('/todo', function(data) 
		alert('HELLO');
		
		var validated = controller.validate(user,password);

		if(validated){
			controller.login(user,password);
		} else {
			alert('Failed', validated);
		}
	};
	

	return Peachy.Views.Login;

});