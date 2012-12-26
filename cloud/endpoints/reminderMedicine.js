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
      "addReminder": {
        "code": "SUCCESS_200",
        "msg": "Added Successfully."
      }
    }
  }
};

var jsonUtils = require('lib/jsonUtils.js');
var reminderMedicineEndpoint = function() {
  // Exposed operations
  this.addRem = function addRem(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Reminder Added Successfully');
      callback(null,success);
    }
    else
    {
      callback(405,"Invalid User");
    }
  }
}
module.exports = new reminderMedicineEndpoint();