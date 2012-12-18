var constants = require('../config/constants.js'),
assert = require('assert'),
util = require('util');

var logout = {
    name: 'logoutAction',
    desc: 'Logout action should return success',
    payload: {
        "request": {
            "head": {
                "sessionId": sessionId
            },
            "payload": {
                "logout": {
            // Empty
            }
            }
        }
    },
    test: function(err, res, done){
   
        return done();
    }
};

module.exports = logout;