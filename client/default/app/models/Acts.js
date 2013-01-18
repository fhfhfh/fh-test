/*--------------------
	app/models/Acts

	Module used to build the act calls used throughout the app
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'cloudFunctionMap',
	    'feedhenry',
	    'models/Session'
], function($, _, Backbone, map, $fh, Session) {


	//interface----------------------------------
	var acts = {

		call : _call
	};

	//implementation-------------------------------
	
	function _call(func, params, successFn, failFn){
		var head = {};
		var payload = {};
		var payloadName = map[func]; // use mapping file to get payload name for function
		payload[payloadName] = params;

		// TODO: get Session from localStorage
		var session = localStorage.getItem('peachy_session');
		head.sessionId = session;
		//-----------------------
		

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

	return acts;

});