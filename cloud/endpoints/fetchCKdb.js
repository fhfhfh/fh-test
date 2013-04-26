/**
 * NodeJS Module: Encapsulates logic for fetchCK Endpoint.
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


/**
     * Process fetchCK request.
     */
var fetchCKEndpoint = function() {
    
   
    // Exposed operations
    this.fetchCK = function fetchCK(reqJson, callback){
      
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[fetchCKEndpoint][fetchCK] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("fetchCK", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
      
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[fetchCKEndpoint][fetchCK] >> Session Details :"+JSON.stringify(data));
            if(data)
            //Fetching data from FH database for Calorie King
            {
                if (jsonUtils.getPath(reqJson, "request.payload.type") == null) 
                {
                    log.error("[fetchCKEndpoint][fetchCK] >> Calorie King Category not provided");
                    var responseJson = respUtils.constructStatusResponse("fetchCK", constants.RESP_AUTH_FAILED, "Calorie King Category not provided",{});
                    return callback(responseJson,null) 
                }
                $fh.db({
                    "act": "list",
                    "type": "CalorieKingDB",
                    "eq" : {
                        "Name":reqJson.request.payload.type
                    }
                        
                }, function(err, data) {
                    if (err) {
                        var fail = respUtils.constructStatusResponse("fetchCK", constants.RESP_SERVER_ERROR, err,{});
                        log.error("[fetchCKEndpoint]["+"fetchCK"+"][READ DATA] >> " + err);
                        return callback(fail,null);
                                        
                    }
                    else{
                        if(!data.list.length)
                        {
                            var fail = respUtils.constructStatusResponse("fetchCK", constants.RESP_NOT_FOUND, "No Records Found",{});
                            log.error("[fetchCKEndpoint]["+"fetchCK"+"][READ DATA] >> No Records Found" );
                            return callback(fail,null);
                        }
                        else{
                            var resp = data.list[0].fields;
                            var sss = JSON.stringify(resp,null,4);
                            var jsonObj = respUtils.constructStatusResponse("fetchCK", constants.RESP_SUCCESS, "Records Fetched Successfully",resp);
                            log.debug("[fetchCKEndpoint][fetchCK][view] Records Fetched Successfully :");
                            return callback(null,jsonObj);//callback returning the response JSON back to client 
                        }
                    }
                });
        } 
        else        //If session not found
        {
            var responseJson = respUtils.constructStatusResponse("fetchCK", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
        });           
}
}
module.exports = new fetchCKEndpoint();