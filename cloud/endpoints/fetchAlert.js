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
var reqUtils = require("../utils/requestUtils.js");

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
                
                
                var requestJson = {
                    EndPointName : "fetchAlert",
                    path : "alert",
                    apiSessionId : data.apiSessionId,
                    method : "GET"
                }
                var respJson = reqUtils.makeRequestCall(requestJson, function(err,res){
                    if(res != null){
                        callback(null,res);      //callback returning the success response JSON back to client
                    }
                    else{
                        return  callback(err,null);
                    }
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