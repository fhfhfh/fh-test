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
      "filterContent": [
      {
        "title": "New",
        "time": "10:45",
        "imglogo": "abc.jpg"
      }
      ]
    }
  }
};

var jsonUtils = require('../lib/jsonUtils.js');
var filterContentEndpoint = function() {
  // Exposed operations
  this.filterContent = function filterContent(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Filter Content');
      callback(null,success);
    }
    else
    {
      callback(405,"Invalid User");
    }
  }
}
module.exports = new filterContentEndpoint();