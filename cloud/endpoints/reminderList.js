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
      "fetchReminder": {
        "madicationName": "ABC",
        "startDate": "10-12-2012",
        "comments": "take medication…"
      }
    }
  }
};

var jsonUtils = require('lib/jsonUtils.js');
var reminderMedicineEndpoint = function() {
  // Exposed operations
  this.fetchReminder = function fetchReminder(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Reminder List');
      callback(null,success);
    }
    else
    {
      callback(405,"Invalid User");
    }
  }
}
module.exports = new reminderMedicineEndpoint();