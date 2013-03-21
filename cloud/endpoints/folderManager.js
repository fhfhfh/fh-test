/**
 * NodeJS Module: Encapsulates logic for folderManager Endpoint.
 * 
 */

var http = require('http');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");

var folderManagerEndpoint = function() {
    
    /**
     * Process folderManager request.
     */
    // Exposed operations
    this.folderManager = function folderManager(reqJson, callback){
      
        //        console.log(JSON.stringify(reqJson));
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[folderManagerEndpoint][folderManager] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("folderManager", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
        
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[folderManagerEndpoint][folderManager] >> Session Details :"+JSON.stringify(data));
            if(data)
            {
                if (jsonUtils.getPath(reqJson, "request.payload.method") == null)         
                {
                    log.error("[folderManagerEndpoint][folderManager] >> Method Not Available");
                    var responseJson = respUtils.constructStatusResponse("folderManager", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                    return callback(responseJson,null) 
                }
                var method = jsonUtils.getPath(reqJson, "request.payload.method");
                //                       console.log("\n-------------"+method+"\n-----------")
                if(method == "add")
                {
                    var recJson = jsonUtils.getPath(reqJson, "request.payload.record");
                    var userId = jsonUtils.getPath(reqJson, "request.payload.record[0].uid");
                    //create a data record for entity
                    $fh.db({
                        "act": "create",
                        "type": "folderDB",
                        "fields": recJson
                    }, function(err, data) {
                        if (err) {
                            var fail = respUtils.constructStatusResponse("folderManager", constants.RESP_SERVER_ERROR, err,{});
                            log.error("[folderManagerEndpoint]["+"folderManager"+"][add] >> " + err);
                            return callback(fail,null);
                
                        } else {
                            var jsonObj = respUtils.constructStatusResponse("folderManager", constants.RESP_SUCCESS, "Record Added Successfully",data);
                            log.info("[folderManagerEndpoint][folderManager][add] >> Record Added Successfully  :"+JSON.stringify(jsonObj)); 
                            return callback(null,jsonObj);//callback returning the response JSON back to client 
                        }
                    });
                }
                else if(method == "delete")
                {
                    var rec = "";
                    if (jsonUtils.getPath(reqJson, "request.payload.uid") == null)         
                    {
                        log.error("[folderManagerEndpoint][folderManager] >> User Id Not Available");
                        var responseJson = respUtils.constructStatusResponse("folderManager", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                        return callback(responseJson,null) 
                    }
                    var userId = jsonUtils.getPath(reqJson, "request.payload.uid");
                    //view a data record for entity 
                    $fh.db({
                        "act": "list",
                        "type": "folderDB",
                        "eq": {
                            "uid":userId
                        }
                    }, function(err, data) {
                        if (err) {
                            log.error("[folderManagerEndpoint]["+"folderManager"+"][delete][list] >> " + err);
                            return callback(err,null);
                
                        }else {
                            rec = data.list;
                            if(rec.length<=0)
                            {
                                log.info("[folderManagerEndpoint][folderManager][Delete] >> No Records to delete :"); 
                                return callback("No records to delete",null);
                            }
                            log.info("[folderManagerEndpoint][folderManager][Delete] >> Record fetched and ready to delete :"+JSON.stringify(rec)); 
                            for(var i=0; i<rec.length;i++){
                                $fh.db({
                                    "act": "delete",
                                    "type": "folderDB",
                                    "guid": rec[i].guid
                                }, function(err, data) {
                                    if (err) {
                                        log.error("[folderManagerEndpoint]["+"folderManager"+"][delete] >> " + err);
                                        return callback(err,null);
                
                                    }else {
                                        var jsonObj = respUtils.constructStatusResponse("folderManager", constants.RESP_SUCCESS, "Records Deleted Successfully for user: "+userId,{});
                                        log.debug("[folderManagerEndpoint][folderManager][Delete] Records Deleted Successfully for user: "+userId+":"+JSON.stringify(jsonObj));
                                        return callback(null,jsonObj);//callback returning the response JSON back to client 
                                    }
                                });
                            }
                        }
                    });
                }
                else if(method == "deleteAll")
                {
                    var rec = "";
                    //view a data record for entity 
                    $fh.db({
                        "act": "list",
                        "type": "folderDB"
                    }, function(err, data) {
            
                        if (err) {
                            log.error("[folderManagerEndpoint]["+"folderManager"+"][deleteAll][list] >> " + err);
                            return callback(err,null);
                
                        }else {
                            rec = data.list;
                            if(rec.length<=0)
                            {
                                log.info("[folderManagerEndpoint][folderManager][DeleteAll] >> No Records to delete :"); 
                                return callback("No records to delete",null);
                            }
                            log.info("[folderManagerEndpoint][folderManager][DeleteAll] >> Record fetched and ready to delete :"+JSON.stringify(rec)); 
                            for(var i=0; i<rec.length;i++){
                                $fh.db({
                                    "act": "delete",
                                    "type": "folderDB",
                                    "guid": rec[i].guid
                                }, function(err, data) {
                                    if (err) {
                                        log.error("[folderManagerEndpoint]["+"folderManager"+"][deleteAll] >> " + err);
                                        return callback(err,null);
                
                                    }else {
                                        var jsonObj = respUtils.constructStatusResponse("folderManager", constants.RESP_SUCCESS, "All Records Deleted Successfully ",{});
                                        log.debug("[folderManagerEndpoint][folderManager][DeleteAll] All Records Deleted Successfully :"+JSON.stringify(jsonObj));
                                        return callback(null,jsonObj);//callback returning the response JSON back to client 
                                    }
                      
                                });
                            }
                        }
                    });
                }
                else if(method == "view")
                {
                    
                    if (jsonUtils.getPath(reqJson, "request.payload.uid") == null)         
                    {
                        log.error("[folderManagerEndpoint][folderManager][view] >> User Id Not Available");
                        var responseJson = respUtils.constructStatusResponse("folderManager", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                        return callback(responseJson,null) 
                    }
                    var userId = jsonUtils.getPath(reqJson, "request.payload.uid");
                    //view a data record for entity
                    $fh.db({
                        "act": "list",
                        "type": "folderDB",
                        "eq": {
                            "uid":userId
                        }
                    }, function(err, data) {
            
                        if (err) {
                            log.error("[folderManagerEndpoint]["+"folderManager"+"][view] >> " + err);
                            return callback(err,null);
                
                        }else {
                            var jsonObj = respUtils.constructStatusResponse("folderManager", constants.RESP_SUCCESS, "Records Fetched Successfully",data);
                            log.debug("[folderManagerEndpoint][folderManager][view] Records Fetched Successfully :"+JSON.stringify(jsonObj));
                            return callback(null,jsonObj);//callback returning the response JSON back to client 
                        }
                    });
                }
                else if(method == "viewAll")
                {
                    //view a data record for entity
                    $fh.db({
                        "act": "list",
                        "type": "folderDB"
                        
                    }, function(err, data) {
            
                        if (err) {
                            log.error("[folderManagerEndpoint]["+"folderManager"+"][viewAll] >> " + err);
                            return callback(err,null);
                
                        }else {
                            var jsonObj = respUtils.constructStatusResponse("folderManager", constants.RESP_SUCCESS, "All Records Fetched Successfully",data);
                            log.debug("[folderManagerEndpoint][folderManager][viewAll]All Records Fetched Successfully :"+JSON.stringify(jsonObj));
                            return callback(null,jsonObj);//callback returning the response JSON back to client 
                        }
                    });
                }
                else if(method == "update")
                {
                    var rec = "";
                    if (jsonUtils.getPath(reqJson, "request.payload.uid") == null)         
                    {
                        log.error("[folderManagerEndpoint][folderManager] >> User Id Not Available");
                        var responseJson = respUtils.constructStatusResponse("folderManager", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                        return callback(responseJson,null) 
                    }
                    var userId = jsonUtils.getPath(reqJson, "request.payload.uid");
                    
                    //view a data record for entity 
                    $fh.db({
                        "act": "list",
                        "type": "folderDB",
                        "eq": {
                            "uid":userId
                        }
                    }, function(err, data) {
                        if (err) {
                            log.error("[folderManagerEndpoint]["+"folderManager"+"][update][list] >> " + err);
                            return callback(err,null);
                
                        }else {
                            rec = data.list;
                            if(rec.length<=0)
                            {
                                log.info("[folderManagerEndpoint][folderManager][Delete] >> No Old Records found to be overwritten :"); 
//                                return callback("No records to update",null);
                            }
                            else{
                            log.info("[folderManagerEndpoint][folderManager][update][Delete] >> Old Record fetched and ready to delete :"+JSON.stringify(rec)); 
                            for(var i=0; i<rec.length;i++){
                                $fh.db({
                                    "act": "delete",
                                    "type": "folderDB",
                                    "guid": rec[i].guid
                                }, function(err, data) {
                                    if (err) {
                                        log.error("[folderManagerEndpoint]["+"folderManager"+"][update] >> Error in deleting old record >> " + err);
                                        return callback(err,null);
                
                                    }else {
                                        //                                        var jsonObj = respUtils.constructStatusResponse("folderManager", constants.RESP_SUCCESS, "Records Deleted Successfully for user: "+userId,{});
                                        log.debug("[folderManagerEndpoint][folderManager][update] Records Deleted Successfully for user: "+userId+":"+JSON.stringify(data));
                                    }
                                });
                            }}
                            var recJson = jsonUtils.getPath(reqJson, "request.payload.record");
                            //create a data record for entity
                            $fh.db({
                                "act": "create",
                                "type": "folderDB",
                                "fields": recJson
                            }, function(err, data) {
                                if (err) {
                                    var fail = respUtils.constructStatusResponse("folderManager", constants.RESP_SERVER_ERROR, err,{});
                                    log.error("[folderManagerEndpoint]["+"folderManager"+"][Update][add] >> " + err);
                                    return callback(fail,null);
                
                                } else {
                                    var jsonObj = respUtils.constructStatusResponse("folderManager", constants.RESP_SUCCESS, "Record Updated Successfully",data);
                                    log.info("[folderManagerEndpoint][folderManager][add] >> Record Updated Successfully  :"+JSON.stringify(jsonObj)); 
                                    return callback(null,jsonObj);//callback returning the response JSON back to client 
                                }
                            });
                        }
                    });
                }
                else
                {
                    log.error("[folderManagerEndpoint]["+"folderManager"+"] >> Invalid Method");
                    return callback("Invalid Method",null);
                }
               
            } 
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("healthHub", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
            
        });       
       
        
              
    }
}
module.exports = new folderManagerEndpoint();