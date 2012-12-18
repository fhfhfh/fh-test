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
    "head": {},
    "payload": {
      "saveMedicine": {
        "peachyPoints": 98
      }
    }
  }
};

var jsonUtils = require('lib/jsonUtils.js');
var peachyPointsEndpoint = function() {
  // Exposed operations
  this.peachyPoints = function peachyPoints(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('*****PeachyPoints******');
      callback(null,success);
    }
    else
    {
      callback(null,"wrong session ID");
    }
  }
}
module.exports = new peachyPointsEndpoint();