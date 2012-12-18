var fail = {
  "response": {
    "head": {},
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
      "addAllergy": {          
        "code": "SUCCESS_200",
        "msg": "Added Successfully."

      }
    }
  }
}

;

var jsonUtils = require('lib/jsonUtils.js');
var addAllergyEndpoint = function() {
  // Exposed operations
  this.addAllergy = function addAllergy(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Allergy Added Successfully');
      callback(null,success);
    }
    else
    {
      callback(null,"wrong session ID");
    }
  }
}
module.exports = new addAllergyEndpoint();