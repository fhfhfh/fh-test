/**
 * NodeJS Module: Encapsulates logic for fetchAllergies Endpoint.
 * 
 */
var http = require('http');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var log = require('../lib/log/log.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var reqUtils = require("../utils/requestUtils.js");


var fetchAllergiesEndpoint = function() {
    /**
     * Process fetchAllergies request.
     */
    // Exposed operations
    this.fetchAllergies = function fetchAllergies(reqJson, callback){
        
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[fetchAllergiesEndpoint][fetchAllergies] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("fetchAllergies", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
      
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[fetchAllergiesEndpoint][fetchAllergies] >> Session Details :"+JSON.stringify(data));
            if(data)
            {
                  
                
                var requestJson = {
                    EndPointName : "fetchAllergies",
                    path : "allergies",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details
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
                var responseJson = respUtils.constructStatusResponse("fetchAllergies", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
}
module.exports = new fetchAllergiesEndpoint();