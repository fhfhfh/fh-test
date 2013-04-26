/**
 * NodeJS Module: Encapsulates logic for createDB Endpoint.
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

var createCKEndpoint = function() {
    
    /**
     * Process createDB request.
     */
    // Exposed operations
    this.createDB = function createDB(reqJson, callback){
      
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[createCKEndpoint][createDB] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("createDB", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
      
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[createCKEndpoint][createDB] >> Session Details :"+JSON.stringify(data));
            if(data)
            {
                console.log("Beginning Creating DB");
                fs.readFile('./cloud/CalorieKingDB/catJSON.txt', function(err, res) {
                    if (err) {
                        var fail = respUtils.constructStatusResponse("createDB", constants.RESP_SERVER_ERROR, "Error reading json file.  "+err,{});
                        log.error("[createDBEndpoint]["+"createDB"+"][readFile] >> Error reading json file  "+err);
                        return callback(fail,null);
                        
                    }
                    var data = JSON.parse(res);
                    for (var i=0;i<data.Food.length;i++){
                        var  dataChunk = data.Food[i]   
           
                        $fh.db({
                            "act": "create",
                            "type": "CalorieKing",
                            "fields": dataChunk
                        }, function(err, data) {
                            if (err) {
                                var fail = respUtils.constructStatusResponse("createDB", constants.RESP_SERVER_ERROR, err,{});
                                log.error("[createDBEndpoint]["+"createDB"+"][add] >> "+dataChunk.Name+"msg:-"+err);
                                return callback(fail,null);
                    
                            } else {
                                var jsonObj = respUtils.constructStatusResponse("createDB", constants.RESP_SUCCESS, "Record Added Successfully",data);
                                log.info("[createDBEndpoint][createDB][add] >> Record Added Successfully   "+dataChunk.Name); 
                                callback(null,jsonObj);
                            }
                        });
                    }
                        
                });
                
            } 
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("createDB", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
        });           
    }
}
module.exports = new createCKEndpoint();