/**
 * NodeJS Module: Encapsulates logic for fetchProcedures Endpoint.
 * 
 */
var http = require('http');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var log = require('../lib/log/log.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");


var fetchProceduresEndpoint = function() {
    /**
     * Process fetchProcedures request.
     */
    // Exposed operations
    this.fetchProcedures = function fetchProcedures(reqJson, callback){
      if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[fetchProceduresEndpoint][fetchProcedures] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("fetchProcedures", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[fetchProceduresEndpoint][fetchProcedures] >> Session Details :"+JSON.stringify(data));
            if(data)
            {
                //Setting the apiSession to fetch the Procedures details      
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
                    port : appConfig.environments[env].urls.port,
                    path : appConfig.environments[env].urls.procedures,
                    method : 'GET',
                    headers : getHeaders
                };

                var reqGet = http.request(optionsGet, function(res) {
                    if (res.statusCode == 403)
                    {
                         var fail = respUtils.constructStatusResponse("fetchProcedures", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                        return  callback(fail,null) 
                    }
                    else if (res.statusCode == 500)
                    {
                        var fail = respUtils.constructStatusResponse("fetchProcedures", constants.RESP_SERVER_ERROR, "Internal server error",{});
                        return  callback(fail,null) 
                    }
                   
                   else if (res.statusCode == 200)
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
                                var jsonObj = respUtils.constructStatusResponse("fetchProcedures", constants.RESP_SUCCESS, "fetchProcedures Success",jsonObject);
                                return callback(null,jsonObj) //callback returning the response JSON back to client 
                            }
                            else        //if complete data not found
                            {
                                var fail = respUtils.constructStatusResponse("fetchProcedures", constants.RESP_SERVER_ERROR, "Internal server error",{});
                                // Error ...!!!
                                return  callback(fail,null) 
                            }
                        })
                    }
                    else               //if GET call is not successful  
                    {
                        var fail = respUtils.constructStatusResponse("fetchProcedures", constants.RESP_SERVER_ERROR, "Internal server error",{});
                        return  callback(fail,null) 
                    }
                });
 
                reqGet.end();
                reqGet.on('error', function(e) {
                    log.error("[fetchProceduresEndpoint][fetchProcedures][regGet] >> " + e);
                    return  callback(fail,null)
                });
            } 
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("fetchProcedures", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
}
module.exports = new fetchProceduresEndpoint();