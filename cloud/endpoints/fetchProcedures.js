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
var reqUtils = require("../utils/requestUtils.js");

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
                
                var requestJson = {
                    EndPointName : "fetchProcedures",
                    path : "procedures",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET"
                }
                // Calling respJson function to make request and getting final response
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
                var responseJson = respUtils.constructStatusResponse("fetchProcedures", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
}
module.exports = new fetchProceduresEndpoint();