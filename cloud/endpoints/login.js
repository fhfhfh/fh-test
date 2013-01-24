var http = require('http');
var sessionManager = require('../lib/session/session.js');
var jsonUtils = require('../lib/jsonUtils.js');
var appConfig = require('../config/appConfig.js')
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');



/**
 * NodeJS Module: Encapsulates logic for Login Endpoint.
 * 
 */
var loginEndpoint = function() {
    
    /**
     * Process login request.
     */
    this.login = function login(reqJson, callback){
         
        // log.debug("[loginEndpoint][Login] >> [REQ]: " + JSON.stringify(reqJson)); 
        // Validate request
        var validationResp = validateLoginRequest(reqJson);
        if (!validationResp.status) {
            log.debug("[loginEndpoint][Login] Bad input - validation failed,: " + JSON.stringify(reqJson));
            var fail = respUtils.constructStatusResponse("Login", constants.RESP_AUTH_FAILED, validationResp.msg,{});
            return callback(fail, null);
        }
        
        // Extract request params
        var userId = jsonUtils.getPath(reqJson, "request.payload.login.userId").trim();
        var password = jsonUtils.getPath(reqJson, "request.payload.login.password").trim();
        log.debug("[loginEndpoint][Login] UserName:" + userId + " Password:" + password);
        
        var jsonObj = {
            login: {
                userId: userId,
                password: password
            }
        }
         
         
        // preparing the header
        var postHeaders = {
            'Content-Type' : 'application/json'
        };
     
        var env = appConfig.current;
                       
        // preparing the post options
        var optionsPost = {
            host : appConfig.environments[env].urls.baseUrl,
            port : appConfig.environments[env].urls.port,
            path : appConfig.environments[env].urls.auth,
            method : 'POST',
            headers : postHeaders
        };

        var apiSessionId = "";
        
        // doing the POST call
        var reqPost = http.request(optionsPost, function(res) {
            if (res.statusCode == 200)
            {
                apiSessionId = res.headers.sessionid;
                if(!apiSessionId)
                {
                    var fail = respUtils.constructStatusResponse("Login", constants.RESP_SERVER_ERROR, "Internal Server Error",{});
                    return callback(fail,null);
                }
                else
                {
                    //Creating the session 
                    sessionManager.createSession(function handleCreateSession(errMsg, data) {

                        // Trouble?
                        if (errMsg != null) {
                            var fail = respUtils.constructStatusResponse("Login", constants.RESP_SERVER_ERROR, errMsg,{});
                            return callback(fail, null);
                        }

                        // Initialize session state.
                        var sessionId = data.sessionId;
                        
                        //preparing object for apiSession
                        var sessionAttrs = {
                            "apiSessionId": apiSessionId
                        };
                 
                        log.debug("Attempting to Save to SessionId: " + sessionId );
                        //adding apisession into session
                        sessionManager.setSessionAttributes(sessionId, sessionAttrs, function onSessionSetAttr(errMsg, success){
                         
                            // Trouble?
                            if (errMsg != null) {
                                var fail = respUtils.constructStatusResponse("Login", constants.RESP_SERVER_ERROR, errMsg,{});
                                return callback(fail, null);
                            }
                            var success = respUtils.constructResponse();
                            success.response.head["sessionId"] = sessionId;
                            //returing success and sessionId to the client 
                            userProfile(sessionId,function cb(err, respData) {
                                if(err)
                                {
                                    var fail = respUtils.constructStatusResponse("Login", constants.RESP_SERVER_ERROR, errMsg,{});
                                    return callback(fail, null);                                        
                                }
                                success.response.payload = respData.response.payload;
                                return callback(null,success);
                            });
                        });
                    });
                }
            }
            else
            {
                var fail = respUtils.constructStatusResponse("Login", constants.RESP_AUTH_FAILED, "Authentication Fail",{});
                return callback(fail, null);
            }
        });
 
        
        reqPost.write(JSON.stringify(jsonObj));
        reqPost.end();
        reqPost.on('error', function(e) {
            console.error(e);
            log.error("[loginEndpoint][login][regPost] >> " + e);
            var fail = respUtils.constructStatusResponse("Login", constants.RESP_AUTH_FAILED, "Authentication Fail",{});
            callback(fail,null)
            
        });

    }
}

module.exports = new loginEndpoint();



// Function to check the validation for username and password
function validateLoginRequest(reqJson) {

    var resp = {
        status: true,
        msg: ""
    };
        
    // Request payload exists?
    if (reqJson == null || reqJson == undefined) {
        resp.status = false;
        resp.msg = "Missing request payload.";
        return resp;
    }

    // UserName specified?
    if (jsonUtils.isEmptyPath(reqJson, "request.payload.login.userId")) {
        resp.status = false;
        resp.msg = "UserName not specified.";
        return resp;
    }

    // Password specified?
    if (jsonUtils.isEmptyPath(reqJson, "request.payload.login.password")) {
        resp.status = false;
        resp.msg = "Password not specified.";
        return resp;
    }

    // Success
    resp.status = true;
    resp.msg = "Success";
    return resp;

} 




/**
     * Process fetchUserProfile request.
     */
// Exposed operations
function userProfile(reqJson, callback){
      
    // Extract sessionId from request params
    var sessionId = reqJson;
        
    //Fetching session details
    sessionManager.getSession(sessionId, function(err, data ){
        log.info("[userProfiletEndpoint][userProfile] >> Session Details :"+JSON.stringify(data)); 
        if(data)
        {
            //Setting the apiSession to fetch the profile details      
            var apiSessionId = data.apiSessionId;
        
            // preparing the header
            var getHeaders = {
                'Content-Type' : 'application/json',
                'sessionId' : apiSessionId
            };
            var env = appConfig.current;
  
            // perparing the GET options
            var optionsGet = {
                host : appConfig.environments[env].urls.baseUrl,
                port : appConfig.environments[env].urls.port,
                path : appConfig.environments[env].urls.userProfile,
                method : 'GET',
                headers : getHeaders
            };


            // doing the HTTP GET call
            var reqGet = http.request(optionsGet, function(res) {
                if (res.statusCode == 200)
                {                    
                    var data="";
                    res.on('data', function(d) {
                        //fetching the complete response that comes in chunks in 'data'
                        data+=d; 
                    });
                    res.on('end',function(){
                        if(data)
                        {
                            var jsonObject;
                            //converting the response data into JSON object
                            jsonObject= JSON.parse(data.toString());
                            var jsonObj = respUtils.constructResponse();
                            jsonObj.response.payload = jsonObject;
                            return callback(null,jsonObj) //callback returning the response JSON back to client 
                        }
                        else        //if complete data not found
                        {
                            var fail = respUtils.constructStatusResponse("userProfile", constants.RESP_SERVER_ERROR, "Internal server error",{});
                            return  callback(fail,null) 
                        }
                    })
                }
                else               //if GET call is not successful  
                {
                    var fail = respUtils.constructStatusResponse("userProfile", constants.RESP_SERVER_ERROR, "Internal server error",{});
                    return  callback(fail,null) 
                }
            });
 
            reqGet.end();
            reqGet.on('error', function(e) {
                console.error(e);
                log.error("[userProfileEndpoint][userProfile][regGet] >> " + e);
                var fail = respUtils.constructStatusResponse("fetchNews", constants.RESP_SERVER_ERROR, e,{});
                return  callback(fail,null)
            });
        } 
        else        //If session not found
        {
            var responseJson = respUtils.constructStatusResponse("userProfile", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
    });           
}