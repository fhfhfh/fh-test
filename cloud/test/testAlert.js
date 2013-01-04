//var constants = require('../config/constants.js'),
assert = require('assert'),
util = require('util');

var alert = {
    name: 'fetchAlertAction',
    desc: 'alert action should return alert JSON',
    payload: {
        "request": {
            "head": {
                "sessionId": "aff109f7-713b-4567-8684-067c5d47bf88"
            },
            "payload": {
                "alert": {
            // Empty
            }
            }
        }
    },
    test: function(err, res, done){
   
        return done();
    }
};

module.exports = alert;