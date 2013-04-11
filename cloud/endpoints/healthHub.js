/**
 * NodeJS Module: Encapsulates logic for healthHubEndpoint.
 * 
 */
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var async = require('../lib/async.js');
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");


var finalJson = respUtils.constructResponse();

/**
 * Process healthHub request.
 */
var healthHubEndpoint = function() {
    
    // Exposed operations
    this.healthHub = function healthHub(reqJson, callback){
        
        
        
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[healthHubEndpoint][healthHub] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("healthHub", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[healthHubEndpoint][healthHub] >> Session Details :"+JSON.stringify(data));
            if(data)
            {
                var JsonObj = [
                {
                    EndPointName : "fetchImmunizations",
                    path : "immunizations",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "immunizations"

                },
                {
                    EndPointName : "fetchProblems",
                    path : "problems",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "problems"

                },
                {
                    EndPointName : "fetchProcedures",
                    path : "procedures",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "procedures"

                },
                {
                    EndPointName : "fetchAllergies",
                    path : "allergies",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details
                    method : "GET",
                    key : "allergies"

                }
                ];
                
                var jsonObj2 = [
                {
                    EndPointName : "fetchSocialHistory",
                    path : "socialHistory",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "socialHistories"
                },
                {
                    EndPointName : "fetchEncounters",
                    path : "encounters",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "encounters"

                },
                {
                    EndPointName : "fetchFamilyHistory",
                    path : "familyHistory",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "familyHistories"
                },
                {
                    EndPointName : "fetchResults",
                    path : "fetchResults",
                    apiSessionId : data.apiSessionId,
                    method :"GET",
                    key : "results"
                },
                {
                    EndPointName : "fetchVitalsigns",
                    path : "vitalsigns",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "vitalSigns"
                }
                ];
                
                //ashish : code to optimise later
                initQueue(JsonObj,function finalCallback(resp){
                    initQueue(jsonObj2,function finalCallback(resp2){
                        callback(null,finalJson);      //callback returning the success response JSON back to client
                    });
                });
                
            } 
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("healthHub", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
            
        });           
    };           
}

module.exports = new healthHubEndpoint();
        
        
        
function initQueue(jsonObj, finalCallback)
{
    //initialising Queue
    var q = async.queue(function (task, queueCallBack) {
        var respJson = reqUtils.makeRequestCall(task, function(err,res){
            if(res != null){
                
                    finalJson.response.payload[task.key] = res.response.payload[task.key];
                    return queueCallBack();
            }
            else{
              
                return  queueCallBack(task.EndPointName);
                    
            }
        });
    }, 8);
                                
                                
    q.drain = function()     // Draining Queue 
    {        
        log.info("[healthHubEndpoint][Queue_drain] >>  Draining Queue ");
        return finalCallback(finalJson);   //callback returning the final JSON including base64 encoded images and video length
    }
          
          
    for (var i=0; i<jsonObj.length; i++)
    {
        //Pushing object into the Queue
        q.push(jsonObj[i], function (err) {         
            if(err)   
                log.error("[healthHubEndpoint][initQueue] >> NO Data Recieved for '"+err+"' Endpoint");
        });
    }
}
