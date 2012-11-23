var fail = {
  "response": {
    "head": {},
    "payload": {
      "status": {
        "code": "ERR_401",
        "msg": "Bad Verification" 
      }
    }
  }
};
var success = {
  "response": {
    "head": {},
    "payload": {
      "status": {
        "code": "SUCCESS_200",
        "msg": "Password Reset Successfully" 
        
      }
    }
  }
};

var jsonUtils = require('lib/jsonUtils.js');
var resetEndpoint = function() {
  // Exposed operations
  this.reset = function reset(reqJson, callback){
    // Extract request params
    var userName = jsonUtils.getPath(reqJson, "request.payload.resetPassword.userId").trim();
    var password = jsonUtils.getPath(reqJson, "request.payload.resetPassword.answer").trim();
    if(userName=="firstname.lastname@email.com" && password=="foobar")
    {
      console.log ('reset request');
      callback(null,success);
    }
    else
    {
      callback(null,fail);
    }
  }
}
module.exports = new resetEndpoint();