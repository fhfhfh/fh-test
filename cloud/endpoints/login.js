var http = require('http');
var sessionManager = require('lib/session/session.js');
var jsonUtils = require('lib/jsonUtils.js');
var appConfig = require('config/appConfig.js')


//Error response JSON
var fail = {
    "response": {
        "head": {},
        "payload": {
            "status": {
                "code": "ERR_401",
                "msg": "Incorrect credentials. Authentication failed."
				
            }
        }
    }
};


/**
 * NodeJS Module: Encapsulates logic for Login Endpoint.
 * 
 */
var loginEndpoint = function() {
    
    /**
     * Process login request.
     */
    this.login = function login(reqJson, callback){
         
        // Validate request
        var validationResp = validateLoginRequest(reqJson);
        if (!validationResp.status) {
            
            return callback(fail, null);
        }
        
        // Extract request params
        var userId = jsonUtils.getPath(reqJson, "request.payload.login.userId").trim();
        var password = jsonUtils.getPath(reqJson, "request.payload.login.password").trim();
        
        
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
     
        
        // preparing the post options
        var optionsPost = {
            host : appConfig.environments.development.urls.baseUrl,
            port : 8888,
            path : appConfig.environments.development.urls.auth,
            method : 'POST',
            headers : postHeaders
        };

        var apiSessionId = "";
        
        // doing the POST call
        var reqPost = http.request(optionsPost, function(res) {
            if (res.statusCode == 200)
            {
                apiSessionId = res.headers.sessionid;
                console.log("API Session ID :- "+apiSessionId);
                if(!apiSessionId)
                {
                    console.log("Invalid User");
                    return callback(fail,null);
                }
                else
                {
                    //Creating the session 
                    sessionManager.createSession(function handleCreateSession(errMsg, data) {

                        // Trouble?
                        if (errMsg != null) {
                            return callback(fail, null);
                        }

                        // Initialize session state.
                        var sessionId = data.sessionId;
                        console.log("WELCOME USER "+ sessionId);
                    
                        //preparing object for apiSession
                        var sessionAttrs = {
                            "apiSessionId": apiSessionId
                        };
                 
                
                        //adding apisession into session
                        sessionManager.setSessionAttributes(sessionId, sessionAttrs, function onSessionSetAttr(errMsg, success){
                         
                            // Trouble?
                            if (errMsg != null) {
                                return callback(fail, null);
                            }
                        
                            //returing success and sessionId to the client 
                            return callback(null, {
                                "response": {
                                    "head": {
                                        "sessionId": sessionId
                                    },
                                    "payload": {
                                        "status": {
                                            "code": "SUCCESS_200",
                                            "msg": "Login Successful."
                                        }
                                    }
                                }
                            }
                            );
                                                                                        
                        });
                
                    });
                }
            }
            else
            {
                return callback(fail, null);
            }
        });
 
        
        reqPost.write(JSON.stringify(jsonObj));
        reqPost.end();
        
        reqPost.on('error', function(e) {
            console.error(e);
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