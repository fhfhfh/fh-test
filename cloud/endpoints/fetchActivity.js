/**
 * NodeJS Module: Encapsulates logic for fetchData Endpoint.
 * 
 */

var request = require('request');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js');
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");



// Fetch Activities
fetchData = function (reqJson, callback){

    if (jsonUtils.getPath(reqJson, "request.head.sessionId") === null)
    {
        log.error("[fetchActivity][fetchData] >> SessionId Not Available");
        var responseJson = respUtils.constructStatusResponse("fetchActivity", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
        return callback(responseJson,null);
    }

    // Extract sessionId from request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();

    //Fetching session details
    sessionManager.getSession(sessionId, function(err, data ){
        log.info("[fetchActivity][fetchData] >> Session Details :"+JSON.stringify(data));
        if(data)
        //Fetching data from FH database for Calorie King
        {
            var requestJson = {
                EndPointName : "fetchActivities",
                path : "activities",
                apiSessionId : data.apiSessionId,
                method :"GET",
                key : reqJson.request.payload.type
            };
            var respJson = reqUtils.makeRequestCall(requestJson, function(err,res){
                if(res !== null){
                    console.info(res);
                    initQueue(res,function finalCallback(resp){
                        callback(null,resp);      //callback returning the success response JSON back to client
                    });
                }
                else{
                    return  callback(err,null);
                }
            });
        }
        else        //If session not found
        {
            var responseJson = respUtils.constructStatusResponse("fetchData", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) ;
        }
    });
};

exports.fetchData = fetchData;