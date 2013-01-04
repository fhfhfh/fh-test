assert = require('assert');


var testUserProfile = {
  name: 'userProfileAction',
  desc: 'Should return the Profile Details',
  payload: {
        },
  test: function(err, res, done){
 return done();
  }
};

module.exports = testUserProfile;