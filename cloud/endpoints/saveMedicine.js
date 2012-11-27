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
        "code": "SUCCESS_200",
        "msg": "Added Successfully."
      }
    }
  }
};

var jsonUtils = require('lib/jsonUtils.js');
var saveMedicineEndpoint = function() {
  // Exposed operations
  this.saveMedicine = function saveMedicine(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Medicine Saved');
      callback(null,success);
    }
    else
    {
      callback(null,"wrong session ID");
    }
  }
}
module.exports = new saveMedicineEndpoint();