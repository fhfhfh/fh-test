/*--------------------
	app/models/Acts

	Module used to build the act calls used throughout the app
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'models/Store',
        'map'
], function($, _, Backbone, store, map) {


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

		//set sessionId for all function calls
		store.load('SessionID', function(res, data){
			if(res){
				head = {'sessionId' : data.val};
			}
		});
	
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
			console.log(res);
			// var status = res.response.payload[payloadName].status;
			// //success
			// if(status.indexOf('ERR') == -1){
				console.log('Act Success', res);
				return successFn(res.response);	
			// }
		}, function(err, msg){
			console.log('Act Fail', err);
			return failFn(err, msg);
		});
	};

	return acts;

});