var http = require('http');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');

var fail = {
    "response": {
        "head": {},
        "payload": {
            "status": {
                "code": "ERR_401",
                "msg": "Invalid Verification" 
            }
        }
    }
};

/**
 * NodeJS Module: Encapsulates logic for fetchAlert Endpoint.
 * 
 */

var fetchAlertEndpoint = function() {
    
    /**
     * Process fetchAlert request.
     */
    // Exposed operations
    this.fetchAlert = function fetchAlert(reqJson, callback){
      
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            console.log("\n\nSESSION DETAILS   :-"+JSON.stringify(data)+"\n\n");
            if(data)
            {
                //Setting the apiSession to fetch the Alert details      
                var apiSessionId = data.apiSessionId;
        
                // preparing the header
                var getHeaders = {
                    'Content-Type' : 'application/json',
                    'sessionId' : apiSessionId
                };
                var env = appConfig.current;
  
                // perparing the GET options
                var optionsGet = {
                    host : appConfig.environments[env].urls.baseUrl,
                    port : 8888,
                    path : appConfig.environments[env].urls.alert,
                    method : 'GET',
                    headers : getHeaders
                };


                console.info('Options prepared:');
                console.info(optionsGet);
                          
                // doing the HTTP GET call
                var reqGet = http.request(optionsGet, function(res) {
                    if (res.statusCode == 200)
                    {                    
                        console.log("statusCode: "+ res.statusCode);
                        var data="";
                        res.on('data', function(d) {
                            //fetching the complete response that comes in chunks in 'data'
                            data+=d; 
                        });
                        res.on('end',function(){
                            if(data)
                            {
                                var jsonObject;
                                //converting the response data into JSON object
                                jsonObject= JSON.parse(data.toString());
                                var jsonObj = {
                                    "response": {
                                        "head": {},
                                        "payload": jsonObject, 
                                        "status":  {
                                            "code": "Success_200",
                                            "msg": "Success"
                                        }
                                    }
                                }
                                return callback(null,jsonObj) //callback returning the response JSON back to client 
                            }
                            else
                            {
                                // Error ...!!!
                                return  callback(fail,null) 
                            }
                        })
                    }
                    else
                    {
                        return callback(fail, null);
                    }
                });
 
                reqGet.end();
                reqGet.on('error', function(e) {
                    console.error(e);
                    return  callback(fail,null)
                });
            } // end of if(data)
            else
            {
                // Error...!!!
                return callback(fail,null) 
            }
        });           
    }
}
module.exports = new fetchAlertEndpoint();