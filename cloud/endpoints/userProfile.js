var fail = {
  "response": {
    "head": {},
    "payload": {
      "status": {
        "code": "ERR_401",
        "msg": "Bad Verification" 
      }
    }
  }
};
var success = {
  "response": {
    "head": {},
    "payload": {
      "userDetails": {
        "userId" : "AC110",
        "imgUrl" : "abc.jpg",
        "firstName" : "Marky",
        "middleName" : "Michael",
        "lastName" : "Mac",
        "email" : "markymac@email.com",
        "birthday" : "1979-12-01",
        "sex" : "M",
        "address": "11 Street Address 1",
        "phone" : "312-555-1221",
        "mobile" : "312-555-1212"
      },
      "privacyPreferences": {
        "personalInfo": {
          "PUB": true,
          "FRD": false,
          "CO": true,
          "PHY": false
        },
        "statusUpdates": {
          "PUB": true,
          "FRD": false,
          "CO": true,
          "PHY": false
        },
        "importantAlerts": {
          "PUB": true,
          "FRD": false,
          "CO": true,
          "PHY": false
        },
        "libraryHistory": {
          "PUB": true,
          "FRD": false,
          "CO": true,
          "PHY": false
        }
      },
      "linkedAccounts" : [
      {
        "accountID": "123",
        "accountName": "Jane Doe"
      }
      ],
	
      "physicians" : [
      {
        "physicianID" : "123",
        "physicianName" : "John Doe"
      }
      ]
    }
  }
}
;

var jsonUtils = require('../lib/jsonUtils.js');
var userProfileEndpoint = function() {
  // Exposed operations
  this.userProfile = function userProfile(reqJson, callback){
    // Extract request params
   var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    // if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    if(sessionId=="f39fc-24e4-456e-9098-38b32cfe5040")
    {
      console.log ('varified user');
      callback(null,success);
    }
    else
    {
      callback(null,"wrong session ID");
    }
  }
}
module.exports = new userProfileEndpoint();