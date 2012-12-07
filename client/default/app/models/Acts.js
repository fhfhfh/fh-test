/*--------------------
	app/models/Acts

	Module used to build the act called used throughout the app
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'models/User',
        'map'
], function($, _, Backbone, User, map) {


	//interface----------------------------------
	Peachy.Models.Acts = {

		call : _call
	};

	//implementation-------------------------------
	var user = new User();
	
	function _call(func, params, successFn, failFn){
		var head = {};
		var payload = {};
		var payloadName = map[func]; // use mapping file to get payload name for function
		payload[payloadName] = params;

		//set sessionId for all function calls
		sess = user.getSession();
		if(sess){
			head = {'sessionId' : sess};
		}
	
		//create required request structure
		params = {
			"request" : {
				"head" : head,
				"payload" : payload
			}
		};

		$fh.act({
			'act' : func,
			'req' : params
		}, function(res){
			console.log('Act Success', res);
			return successFn(res.response);
		}, function(err, msg){
			console.log('Act Fail', err);
			return failFn(err, msg);
		});
	};

	return Peachy.Models.Acts;

});