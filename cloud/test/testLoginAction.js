assert = require('assert');


var login = {
    name: 'loginAction',
    desc: 'Login should return the session ID',
    payload: {
        "request": {
            "head": {
            // Empty
            },
            "payload": {
                "login": {
                    "userId": "jsmith101",
                    "password": "12345"
                }
            }
        }
    },
    test: function(err, res, done){
        return done();
    }
};

module.exports = login;