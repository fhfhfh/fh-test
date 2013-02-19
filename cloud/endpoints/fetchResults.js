/**
 * NodeJS Module: Encapsulates logic for fetchResultsEndpoint.
 * 
 */
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");


var fetchResultsEndpoint = function() {
    /**
     * Process fetchResults request.
     */
    // Exposed operations
    this.fetchResults = function fetchResults(reqJson, callback){
       
        // Extract request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
              
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[fetchResultsEndpoint][fetchResults] >> Session Details :"+JSON.stringify(data));
            if(data != null)
            {
                 var requestJson = {
                    EndPointName : "fetchResults",
                    path : "fetchResults",
                    apiSessionId : data.apiSessionId,
                     method :"GET"
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
                var responseJson = respUtils.constructStatusResponse("fetchResults", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
}
module.exports = new fetchResultsEndpoint();