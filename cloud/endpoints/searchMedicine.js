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
      "searchMedicine": [
      {
        "medicineId": "123123",
        "medicineName": "crosine" 
      //Morefieldstodefineamedicine                    
      }
      ]
    }
  }
}

;

var jsonUtils = require('../lib/jsonUtils.js');
var searchMedicineEndpoint = function() {
  // Exposed operations
  this.searchMedicine = function searchMedicine(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Medicine Found');
      callback(null,success);
    }
    else
    {
      callback(null,"wrong session ID");
    }
  }
}
module.exports = new searchMedicineEndpoint();