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
      "testResult": [
        {
          "imgUrl": "abc.jpg",
          "title": "New test result",
          "time": "10:45",
          "date": "2012-12-11",
          "description": "abcd…"
        }
      ]
    }
  }
}
;

var jsonUtils = require('../lib/jsonUtils.js');
var fetchTestResultListEndpoint = function() {
  // Exposed operations
  this.fetchTestResult = function fetchTestResult(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Test Result List Fetched');
      callback(null,success);
    }
    else
    {
      callback(405,"Invalid User");
    }
  }
}
module.exports = new fetchTestResultListEndpoint();