/**
 * NodeJS Module: Encapsulates logic for fetchAlert Endpoint.
 * 
 */

var http = require('http');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');

var fetchAlertEndpoint = function() {
    
    /**
     * Process fetchAlert request.
     */
    // Exposed operations
    this.fetchAlert = function fetchAlert(reqJson, callback){
      
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[fetchAlertEndpoint][fetchAlert] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("fetchAlert", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
      
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[fetchAlertEndpoint][fetchAlert] >> Session Details :"+JSON.stringify(data));
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
                    port : appConfig.environments[env].urls.port,
                    path : appConfig.environments[env].urls.alert,
                    method : 'GET',
                    headers : getHeaders
                };

                // doing the HTTP GET call
                var reqGet = http.request(optionsGet, function(res) {
                   if (res.statusCode == 403)
                    {
                         var fail = respUtils.constructStatusResponse("fetchAlert", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                        return  callback(fail,null) 
                    }
                    else if (res.statusCode == 500)
                    {
                        var fail = respUtils.constructStatusResponse("fetchAlert", constants.RESP_SERVER_ERROR, "Internal server error",{});
                        return  callback(fail,null) 
                    }
                   
                   else if (res.statusCode == 200)
                    {                    
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
                                var jsonObj = respUtils.constructStatusResponse("fetchAlert", constants.RESP_SUCCESS, "fetchAlert Success",jsonObject);
                                return callback(null,jsonObj) //callback returning the response JSON back to client 
                            }
                            else        //if complete data not found
                            {
                                var fail = respUtils.constructStatusResponse("fetchAlert", constants.RESP_SERVER_ERROR, "Internal server error",{});
                                return  callback(fail,null) 
                            }
                        })
                    }
                    else               //if GET call is not successful  
                    {
                        var fail = respUtils.constructStatusResponse("fetchAlert", constants.RESP_SERVER_ERROR, "Internal server error",{});
                        return  callback(fail,null) 
                    }
                });
 
                reqGet.end();
                reqGet.on('error', function(e) {
                    log.error("[fetchAlertEndpoint][fetchAlert][regGet] >> " + e);
                    var fail = respUtils.constructStatusResponse("fetchAlerts", constants.RESP_SERVER_ERROR,e,{});
                    return  callback(fail,null)
                });
            } 
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("fetchAlert", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
}
module.exports = new fetchAlertEndpoint();