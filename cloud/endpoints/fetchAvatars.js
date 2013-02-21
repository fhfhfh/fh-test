/**
 * NodeJS Module: Encapsulates logic for fetchAvatars Endpoint.
 * 
 */

var http = require('http');
var fs = require('fs');
var async = require('../lib/async.js');
var request = require('request');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");

var fetchAvatarsEndpoint = function() {
    
    /**
     * Process fetchAvatars request.
     */
    // Exposed operations
    this.fetchAvatars = function fetchAvatars(reqJson, callback){
      
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[fetchAvatarsEndpoint][fetchAvatars] >> Session Details :"+JSON.stringify(data));
            if(data)
            {
                var requestJson = {
                    EndPointName : "fetchAvatars",
                    path : "avatars",
                    apiSessionId : data.apiSessionId,
                    method : "GET"
                }
                var respJson = reqUtils.makeRequestCall(requestJson, function(err,res){
                    if(res != null){
                        
                        initQueue(res,function finalCallback(res){
                            callback(null,res);      //callback returning the success response JSON back to client
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
                var responseJson = respUtils.constructStatusResponse("fetchAvatars", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
   
    function initQueue(jsonObj, finalCallback)
    {
        var finalJson = [];
        var imgUrl;
        var q = async.queue(function (task, queueCallBack) {
            var url = task.imageUrl;
                                    
            //Requesting image from the URL
            request({
                url: url,
                encoding: null
            }, function (err, res, body){
                
                if (!err && res && res.statusCode == 200) {  
                    log.debug("[fetchAvatarsEndpoint]"+"[initQueue] Status code>> " + res.statusCode)
                    var image = body.toString('base64');    //Encoding image into base64 
                    task["image64"] = image;
                    finalJson.push(task);
                    //                  log.debug("[fetchAvatarsEndpoint]"+"[initQueue]>> , " + );
                    queueCallBack();
                } 
                else    //If image request fails
                {
                    log.debug("[fetchAvatarsEndpoint]"+"[initQueue]>> Image request failed, " + err);
                    queueCallBack(err);
                                            
                }
            });
        }, 7);
                                
                                
        q.drain = function() {         // Draining Queue 
            jsonObj.response.payload.avatars = finalJson;
            log.debug("[fetchAvatarsEndpoint]"+"[initQueue]>> final JSON retun")
            return finalCallback(jsonObj);   //callback returning the final JSON including base64 encoded images 
        }
                                
        for (var i=0; i<jsonObj.response.payload.avatars.length; i++)
        {
            imgUrl = jsonObj.response.payload.avatars[i];
            //Pushing elemets into the Queue
            q.push(imgUrl, function (err) {         
                if(err)     // Error if no URL not found
                    log.error("[fetchAvatarsEndpoint][fetchAvatars][regGet] >> No Data To Convert For Avatar Id :- "+imgUrl.avatarId+" "+err);
            });
                                
        }
    }
}
module.exports = new fetchAvatarsEndpoint();