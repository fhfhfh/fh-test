/**
 * NodeJS Module: Encapsulates logic for deleteCK Endpoint.
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
     * Process deleteCK request.
     */
var deleteCKEndpoint = function() {
    
   
    // Exposed operations
    this.deleteCK = function deleteCK(reqJson, callback){
      
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[deleteCKEndpoint][deleteCK] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("deleteCK", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
      
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //deleteing session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[deleteCKEndpoint][deleteCK] >> Session Details :"+JSON.stringify(data));
            if(data)
            //deleteing data from FH database for Calorie King
            {
                
                var rec = "";
                //view a data record for entity 
                $fh.db({
                    "act": "list",
                    "type": "CalorieKing_DB"
                }, function(err, data) {
            
                    if (err) {
                        log.error("[deleteCKEndpoint]["+"deleteCK"+"][deleteAll][list] >> " + err);
                        return callback(err,null);
                
                    }else {
                        rec = data.list;
                        if(rec.length<=0)
                        {
                            log.info("[deleteCKEndpoint][deleteCK][DeleteAll] >> No Records to delete :"); 
                            return callback("No records to delete",null);
                        }
//                        log.info("[deleteCKEndpoint][deleteCK][DeleteAll] >> Record fetched and ready to delete :"+JSON.stringify(rec)); 
                        for(var i=0; i<rec.length;i++){
                            $fh.db({
                                "act": "delete",
                                "type": "CalorieKing_DB",
                                "guid": rec[i].guid
                            }, function(err, data) {
                                if (err) {
                                    log.error("[deleteCKEndpoint]["+"deleteCK"+"][deleteAll] >> " + err);
                                    return callback(err,null);
                
                                }else {
                                    var jsonObj = respUtils.constructStatusResponse("deleteCK", constants.RESP_SUCCESS, "Record Deleted Successfully ",{});
                                    log.debug("[deleteCKEndpoint][deleteCK][DeleteAll]  Record Deleted Successfully :");
                                    return callback(null,jsonObj);//callback returning the response JSON back to client 
                                }
                      
                            });
                        }
                    }
                });
            
            } 
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("deleteCK", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
}
module.exports = new deleteCKEndpoint();