/**
 * NodeJS Module: Encapsulates logic for saveUserProfileEndpoint.
 *
 */
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");
var http = require('http');


var saveUserProfileEndpoint = function() {
    /**
     * Process saveUserProfile request.
     */
    // Exposed operations
    this.saveUserProfile = function saveUserProfile(reqJson, callback){

        // Extract request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();


        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[saveUserProfileEndpoint][saveUserProfile] >> Session Details :"+JSON.stringify(data));
            if(data != null)
            {

                // preparing the header
                var createHeaders = {
                    'Content-Type' : 'application/json',
                    'sessionId' : data.apiSessionId
                };


                var env = appConfig.current;

                // perparing the GET/POST/PUT options
                var options = {
                    host : appConfig.environments[env].urls.baseUrl,
                    port : appConfig.environments[env].urls.port,
                    path : appConfig.environments[env].urls["userProfile"],
                    method : "PUT",
                    headers : createHeaders
                };


                //Making the http request
                var reqGet = http.request(options, function(res) {
                    if (res.statusCode == 403)
                    {
                        var fail = respUtils.constructStatusResponse("saveUserProfile", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                        log.debug("[saveUserProfile] >> [reqPut] - HTTP response Status 403 received");
                        return  callback(fail,null)
                    }
                    else if (res.statusCode == 500)
                    {
                        var fail = respUtils.constructStatusResponse("saveUserProfile", constants.RESP_SERVER_ERROR, "Internal server error",{});
                        log.debug("[saveUserProfileEndpoint] >> [makeRequestCall] - HTTP response Status 500 received");
                        return  callback(fail,null)
                    }
                    else if (res.statusCode == 200)
                    {
                        var jsonObj = {
                            "response" : {
                                "head" : {
                                },
                                "payload" : {
                                    "status":{
                                        "msg" : "Success",
                                        "code" : "SUCCESS_200"
                                    }
                                }
                            }
                        };
                        return callback(null,jsonObj);      //callback returning the success response JSON back
                    }
                    else               //if GET call is not successful
                    {
                        var fail = respUtils.constructStatusResponse("saveUserProfileEndpointName", constants.RESP_SERVER_ERROR, "Internal server error",{});
                        log.debug("["+"saveUserProfileEndpointName"+"] >> [makeRequestCall] - HTTP response Status 500 received");
                        return  callback(fail,null)
                    }
                });
                var params = ""+JSON.stringify(reqJson.request.payload);
                reqGet.write(params);
                reqGet.end();
                reqGet.on('error', function(e) {
                    log.error("["+"saveUserProfileEndpointName"+"Endpoint]["+"saveUserProfileEndpointName"+"][regGet] >> " + e);
                    var fail = respUtils.constructStatusResponse("saveUserProfileEndpointName", constants.RESP_SERVER_ERROR, e,{});
                    log.debug("["+"saveUserProfileEndpointName"+"] >> [makeRequestCall] [regGet] - HTTP response Status 500 received");
                    return  callback(fail,null)
                });
            }
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("saveUserProfile", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null)
            }
        });
    }
}
module.exports = new saveUserProfileEndpoint();