var fail = {
  "response": {
    "head": {
    },
    "payload": {
      "status": {
        "code": "ERR_YYY",
        "msg": "Error Message."
      }
    }
  }
};
var success = {
  "response": {
    "head": {
    },
    "payload": {
      "status": {
        "code": "SUCCESS_200",
        "msg": "Profile updated successfully."
      }
    }
  }
}
;

var jsonUtils = require('lib/jsonUtils.js');
var saveUserProfileEndpoint = function() {
  // Exposed operations
  this.sup = function sup(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Profile saved');
      callback(null,success);
    }
    else
    {
      callback(405,"Invalid User");
    }
  }
}
module.exports = new saveUserProfileEndpoint();