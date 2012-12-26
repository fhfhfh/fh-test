assert = require('assert');


var testUserProfile = {
  name: 'userProfileAction',
  desc: 'Should return the Profile Details',
  payload: {
//            'Content-Type' : 'application/json',
//            'Content-Length' : Buffer.byteLength(jsonObj, 'utf8'),
//            'sessionId' : 'd096b7af-b5db-4e0a-9cad-76743b763dc6'
        },
  test: function(err, res, done){
 return done();
  }
};

module.exports = testUserProfile;