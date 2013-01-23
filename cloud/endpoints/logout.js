/**
 * NodeJS Module: Encapsulates logic for Logout Endpoint.
 * 
 */

//Dependencies
var http = require('http');
var sessionManager = require('../lib/session/session.js');
var jsonUtils = require('../lib/jsonUtils.js');
var appConfig = require('../config/appConfig.js')
var log = require('../lib/log/log.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");


var successResponseJson = respUtils.constructStatusResponse("logout", constants.RESP_SUCCESS, "Logout Successful.",{});

var logoutEndpoint = function() {  
    
    /**
     * Process login request.
     * Exposed operations
     */
    this.logout = function logout(reqJson, callback){
        
        log.debug("[LogoutEndpoint][Logout] >> [REQ]: " + JSON.stringify(reqJson)); 
        
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            if (data)
            {
                log.info("[LogoutEndpoint][Logout] >> Session Id Found"); 
                // preparing the header
                var postheaders  = {
                    'Content-Type' : 'application/json',
                    'sessionId' : sessionId
                };
                
                // preparing body 
                var postBody = {
                    logout: {
                }
                }
                
                var env = appConfig.current;
                
                
                //  post options
                var optionspost = {
                    host : appConfig.environments[env].urls.baseUrl,
                    port : appConfig.environments[env].urls.port,
                    path : appConfig.environments[env].urls.auth,
                    method : 'POST',
                    headers : postheaders
                };
                //doing the http request
                var reqPost = http.request(optionspost, function(res,err) {
                    log.info("[LogoutEndpoint][Logout] >> Status Code :"+res.statusCode); 
                   // console.log("statusCode: "+res.statusCode);
                    if (res.statusCode==200)
                    {
                        //Distroying session 
                        sessionManager.destroySession(sessionId, function(errMsg, successObj) {
                            
                            // success response
                            return callback(null, successResponseJson);                
            
                        });
                    }
                    else
                        return callback(null, successResponseJson); 
                });
                
                reqPost.write(JSON.stringify(postBody));
                reqPost.end();
            }// end of "if(data)"
            
            else
            {
                log.info("[LogoutEndpoint][Logout] >> Session Id Not Found"); 
              // success response
                return callback(null, successResponseJson);                
            }
        });
    }
}
module.exports = new logoutEndpoint();