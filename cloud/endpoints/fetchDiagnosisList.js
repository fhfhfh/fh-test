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
      "diagnosis": [
      {
        "diagnosisId": "AZ101",
        "event": "diagnosis",
        "date": "2012-12-07",
        "time": "10:45",
        "description": "",
        "physicianContactDetail": {
          "name": "Dr.John",
          "phone": "01-555-7788",
          "fax": "01-555-7788",
          "address": {
            "adderss1": "add1",
            "address2": "add2",
            "address3": "add3"
          }
        },
        "location": "46.38S,115.36E",
        "fileAttachment": [
        {
          "attachmentName": "pqr"
        }],
        "relatedContent": [
        {
          "imageUrl": "abc.jpg",
          "videoUrl": "vid.avi",
          "descriptionUrl": "xyz",
          "description": "abcd"
        }
        ]
                  
      }]
    }
  }
};

var jsonUtils = require('lib/jsonUtils.js');
var fetchDiagnosisListEndpoint = function() {
  // Exposed operations
  this.fetchDiagnosis = function fetchDiagnosis(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Diagnosis List Fetched');
      callback(null,success);
    }
    else
    {
      callback(405,"Invalid User");
    }
  }
}
module.exports = new fetchDiagnosisListEndpoint();