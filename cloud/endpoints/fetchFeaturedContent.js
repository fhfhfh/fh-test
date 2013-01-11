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
      "featuredContent": [
      {
        "smallImageUrl": "abc.jpeg",
        "bigImageUrl": "xyz.jpg",
        "description": "abcd…",
        "title": "featuredarticle",
        "smallDescription": "thisarticle",
        "largeDescription": "thisarticle"
                    
      }]
    }
  }
}
;

var jsonUtils = require('../lib/jsonUtils.js');
var fetchFeaturedContentEndpoint = function() {
  // Exposed operations
  this.fetchFeaturedContent = function fetchFeaturedContent(reqJson, callback){
    // Extract request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
    if(sessionId=="4860-9e4b-3ca8d2cb3df7")
    {
      console.log ('Fetch   Featured   Content');
      callback(null,success);
    }
    else
    {
      callback(405,"Invalid User");
    }
  }
}
module.exports = new fetchFeaturedContentEndpoint();
