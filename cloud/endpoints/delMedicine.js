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
      "deleteMedicine": {
        "code": "SUCCESS_200",
        "msg": "Deleted Successfully."
      }
    }
  }
};

var jsonUtils = require('../lib/jsonUtils.js');
var delMedicineEndpoint = function() {
  // Exposed operations
  this.delMedicine = function delMedicine(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Medicine Deleted');
      callback(null,success);
    }
    else
    {
      callback(null,"wrong session ID");
    }
  }
}
module.exports = new delMedicineEndpoint();