var success = {
  "response": {
    "head": {},
    "payload": {
      "logout": {
        "msg": "User logged out."

      }
    }
  }
};

var jsonUtils = require('lib/jsonUtils.js');
var logoutEndpoint = function() {
  // Exposed operations
  this.logout = function logout(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('LOGOUT');
      callback(null,success);
    }
    else
    {
      callback(null,"Sorry cant logout");
    }
  }
}
module.exports = new logoutEndpoint();