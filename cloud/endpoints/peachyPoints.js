/**
 * NodeJS Module: Encapsulates logic for peachyPointsEndpoint.
 * 
 */
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");


var peachyPointsEndpoint = function() {
    /**
     * Process peachyPoints request.
     */
    // Exposed operations
    this.peachyPoints = function peachyPoints(reqJson, callback){
        
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[peachyPointsEndpoint][peachyPoints] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("peachyPoints", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
       
        // Extract request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
              
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[peachypointsEndpoint][fetchAvatars] >> Session Details :"+JSON.stringify(data));
            if(data != null)
            {
                var requestJson = {
                    EndPointName : "peachyPoints",
                    path : "peachyPoints",
                    apiSessionId : data.apiSessionId,
                    method : "GET"
                }
               var respJson = reqUtils.makeRequestCall(requestJson, function(err,res){
                    if(res != null){
                        
                        callback(null,res);      //callback returning the success response JSON back to client
                       
                    }
                    else
                    {
                        return  callback(err,null);
                    }
                });
            } 
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("peachyPoints", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
}
module.exports = new peachyPointsEndpoint();