/**
 * NodeJS Module: Encapsulates logic for updateProfileEndpoint.
 * 
 */
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");


var updateProfileEndpoint = function() {
    /**
     * Process updateProfile request.
     */
    // Exposed operations
    this.updateProfile = function updateProfile(reqJson, callback){
       
        // Extract request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
              
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[updateProfileEndpoint][fetchupdateProfile] >> Session Details :"+JSON.stringify(data));
            if(data != null)
            {
                
                var requestJson = {
                    EndPointName : "updateProfile",
                    path : "userProfile",
                    apiSessionId : data.apiSessionId,
                    method :"PUT",
                    jsonObj : reqJson.request.payload
                }

                var respJson = reqUtils.makeRequestCall(requestJson, function(err,res){
                    if(res != null){
                    
                        var jsonObject = res.response.payload;
                        var jsonObj = respUtils.constructResponse();
                        jsonObj.response.payload = jsonObject;
                        return callback(null,jsonObj) //callback returning the response JSON back to client 
                    }
                    else
                    {
                        return  callback(err,null);
                    }
                });
            } 
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("updateProfile", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
}
module.exports = new updateProfileEndpoint();