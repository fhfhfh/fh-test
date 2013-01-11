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
      "searchAllergy": [
        {
          "allergyName": "peanut",
          "allergyId": "A110"                    
        }
      ]
    }
  }
}
;

var jsonUtils = require('../lib/jsonUtils.js');
var searchAllergyEndpoint = function() {
  // Exposed operations
  this.searchAllergy = function searchAllergy(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Search Allergy');
      callback(null,success);
    }
    else
    {
      callback(null,"wrong session ID");
    }
  }
}
module.exports = new searchAllergyEndpoint();
