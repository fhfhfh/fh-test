/*--------------------
	app/models/Acts

	Module used to build the act calls used throughout the app
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'cloudFunctionMap',
	    'feedhenry',
	    'models/session',
	    'models/Store'
], function($, _, Backbone, map, $fh, session, Store) {


	//interface----------------------------------
	var acts = {

		call : _call
	};

	//implementation-------------------------------

	function _call(func, params, successFn, failFn){
		var head = {};
		var payload = {};
		var payloadName = map[func]; // use mapping file to get payload name for function
		var sessId = session.get('id');

		if(payloadName === ''){
			payload = params;
		}else {
			payload[payloadName] = params;	
		}
		
		if(sessId == undefined){
			Store.load('peachy_session', function(bool, res){
				sessId = res;
				head.sessionId = sessId;
			});
		}

		head.sessionId = sessId;
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
			console.log('Act Success', res.response.payload, res);
			return successFn(res.response);
		}, function(err, msg){
			console.log('Act Fail', err);
			return failFn(err, msg);
		});
	};

	return acts;

});
