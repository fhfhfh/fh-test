var fail ={
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
      "medicineList":[

      {
        "medicineId" : "AB1234",
        "medicineName": "Lunesta",
        "type": "medicine/supplements/devices ",
        "reminder": "1day/1week/1month/1year",
        "smallLogo" : "abc.jpg",
        "largeLogo" : "xyz.jpg",
        "expDate": "2012-12-11",
        "description" : "...",
        "renewalInstruction": {
          "pharmacyId": "1231",
          "name": "SuperDrug",
          "phone": "01-555-7788",
          "fax": "01-555-7787",
          "address": {
            "address1": "",
            "address2": "",
            "address3": ""
          }
        },
        "alternatePharmacy": [

        {
          "pharmacyId": "1231",
          "name": "SuperDrug",
          "phone": "01-555-7788",
          "fax": "01-555-7787",
          "address": {
            "address1": "",
            "address2": "",
            "address3": ""
          }
        }
        ],


        "relatedContent" : [
        {
          "imageUrl" : "",
          "videoUrl" : "",
          "descriptionUrl" : "",
          "description" : ""
        }
        ]
      }]
    }
  }
}

;

var jsonUtils = require('../lib/jsonUtils.js');
var medicineCabinetEndpoint = function() {
  // Exposed operations
  this.medicineCabinet = function medicineCabinet(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('medicineCabinetList Success ');
      callback(null,success);
    }
    else
    {
      callback(null,"wrong session ID");
    }
  }
}
module.exports = new medicineCabinetEndpoint();
