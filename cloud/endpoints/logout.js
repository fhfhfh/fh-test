//Dependencies
var http = require('http');
var sessionManager = require('../lib/session/session.js');
var jsonUtils = require('../lib/jsonUtils.js');
var appConfig = require('../config/appConfig.js')

var successResponseJson = {
    "response": {
        "head": {
        },
        "payload": {
            "status": {
                "code": "SUCCESS_200",
                "msg": "Logout Successful."
            }
        }
    }
} ;
/**
 * NodeJS Module: Encapsulates logic for Logout Endpoint.
 * 
 */
var logoutEndpoint = function() {  
    
    /**
     * Process login request.
     * Exposed operations
     */
    this.logout = function logout(reqJson, callback){
        
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            if (data)
            {
                console.log("\n\n ---- SESSION ID FOUND ----"); 
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
                //  post options
                var optionspost = {
                    host : appConfig.environments.development.urls.baseUrl,
                    port : 8888,
                    path : appConfig.environments.development.urls.auth,
                    method : 'POST',
                    headers : postheaders
                };
                //doing the http request
                var reqPost = http.request(optionspost, function(res,err) {
                    console.log("statusCode: "+res.statusCode);
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
                console.log("\n\n ---- SESSION ID NOTFOUND ----"); 
                // success response
                return callback(null, successResponseJson);                
            }
        });
    }
}
module.exports = new logoutEndpoint();