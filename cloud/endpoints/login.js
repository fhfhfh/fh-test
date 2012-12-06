var jsonUtils = require('../lib/jsonUtils.js');
var respUtils = require('../utils/responseUtils.js');



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


var loginEndpoint = function() {
  // Exposed operations
  this.login = function login(reqJson, callback){
    console.log(reqJson);
    // Validate request
    var validationResp = validateLoginRequest(reqJson);
    if (!validationResp.status) {
//      log.debug("[LoginEndpoint][Login] Bad input - validation failed, with request: " + util.inspect(reqJson));
      var errResp = respUtils.constructStatusResponse("error", "ERR_400", validationResp.msg);
      return callback(errResp, null);
    }
    
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











