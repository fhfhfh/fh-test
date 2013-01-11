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
      "medicalHistory": {
        "allergy": [
        {
          "allergyId": "XYZ123",
          "smallImgUrl": "abc.jpg",
          "title": "Peanut",
          "smallDescription": "peanut allergy…",
          "largeImgUrl": "ABC.jpg",
          "bigDescription": "peanut allergy …",
          "relatedContents": [
          {
            "imgUrl": "abc.jpg"
          }
          ]
        }
        ],
        "immunization": [
        {
                        
        }
        ],
        "lifeStyle": [
        {
                        
        }
        ],
        "familyHistory": [
        {
                        
        }
                
        ]
      }
    }
  }
};

var jsonUtils = require('../lib/jsonUtils.js');
var fetchMedicalHistoryEndpoint = function() {
  // Exposed operations
  this.fetchMedicalHistory = function fetchMedicalHistory(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Medical History');
      callback(null,success);
    }
    else
    {
      callback(405,"Invalid User");
    }
  }
}
module.exports = new fetchMedicalHistoryEndpoint();
