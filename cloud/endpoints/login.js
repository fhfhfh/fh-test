var fail = {
  "response": {
    "head": {},
    "payload": {
      "error": {
        "msg": "Authentication failed."
				
      }
    }
  }
};
var success = {
	"response": {
		"head": {
			// SessionId for the client
			"sessionId": "f39fc-24e4-456e-9098-38b32cfe5040"
		        },
		"payload": {
			"login": {
				"msg": "Login Successful.",
				"status": "SUCCESS_200"
				}
			}
	    }
};

var jsonUtils = require('lib/jsonUtils.js');
var loginEndpoint = function() {
  // Exposed operations
  this.login = function login(reqJson, callback){
    // Extract request params
    var userName = jsonUtils.getPath(reqJson, "request.payload.login.userId").trim();
    var password = jsonUtils.getPath(reqJson, "request.payload.login.password").trim();
    if(userName=="demo" && password=="demo")
    {
      console.log ('login request');
      callback(null,success);
    }
    else
    {
      callback(null,fail);
    }
  }
}
module.exports = new loginEndpoint();