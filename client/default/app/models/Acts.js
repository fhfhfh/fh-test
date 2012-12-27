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
            console.log("login func :- "+func);

            if(func !== "loginAction")
            {
                //set sessionId for all function calls
                store.load('SessionID', function(res, data){
                    if(res){
                        head = {
                            'sessionId' : data.val
                        };
                    }
                    console.log(data);
                });
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
                console.log(res);
                console.log('Act Success', res);
                return successFn(res.response);
            }, function(err, msg){
                console.log('Act Fail', err);
                return failFn(err, msg);
            });
        };

        return acts;

    });