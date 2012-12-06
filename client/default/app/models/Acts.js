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
	Peachy.Models.Acts = function({

		call = _call
	});
	
	//scripts------------------------------------


	//implementation-------------------------------
	var user = User;
	
	function _call(func, params, successFn, failFn){
		//set sessionId for all function calls
		sess = user.getSession();
		if(sess){
			params.sessionId = sess;
		}

		// use mapping file to get payload name for function
		var payloadName = map.func;

		//create required request structure
		params = {
			'request' : {
				'head' : {},
				'payload' : {
					payloadName : params
				}
			}
		};

		$fh.act({
			'act' : func,
			'req' : params
		}, function(res){
			console.log('Act Success', res);
			return successFn(res);
		}, function(err, msg){
			console.log('Act Fail', err);
			return failFn(err, msg);
		});
	};

	return Peachy.Models.Acts;

});