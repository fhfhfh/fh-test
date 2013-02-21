/**
 * NodeJS Module: Encapsulates logic for userProfile Endpoint.
 * 
 */

var http = require('http');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');


var userProfileEndpoint = function() {
    
    /**
     * Process fetchUserProfile request.
     */
    // Exposed operations
    this.userProfile = function userProfile(reqJson, callback){
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[userProfileEndpoint][userProfile] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("userProfile", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[userProfileEndpoint][userProfile] >> Session Details :"+JSON.stringify(data)); 
            if(data)
            {
                
                
                var requestJson = {
                    EndPointName : "userProfile",
                    path : "userProfile",
                    apiSessionId : data.apiSessionId,
                    method :"GET"
                }
                var respJson = reqUtils.makeRequestCall(requestJson, function(err,res){
                    if(res != null){
                        console.info(res);
                        initQueue(res,function finalCallback(resp){
                            callback(null,resp);      //callback returning the success response JSON back to client
                        });
                    }
                    else
                    {
                        return  callback(err,null);
                    }
                });
            } 
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("userProfile", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
}
module.exports = new userProfileEndpoint();