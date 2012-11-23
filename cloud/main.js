
// Dependencies: Endpoint Implementations
var loginEndpoint = require("endpoints/login.js");
var logoutEndpoint =  require("endpoints/logout.js");
var resetEndpoint = require("endpoints/reset.js");
//var userProfileEndpoint =  require("endpoints/userProfile.js");


exports.loginAction = loginAction;
exports.logoutAction = logoutAction;
exports.resetAction = resetAction;

//--------------------------------------login----------------------------------------
function loginAction(params, callback) {
  console.log(JSON.stringify(params));
  loginEndpoint.login(params,function cb(err, respData) {
    callback(err,respData);
  });
};



//-------------------------------------logout----------------------------------------

function logoutAction(params, callback) {
  console.log(JSON.stringify(params));
  logoutEndpoint.logout(params,function cb(err, respData) {
    callback(err,respData);
  });
};

//--------------------------------------reset----------------------------------------
function resetAction(params, callback) {
  console.log(JSON.stringify(params));
  resetEndpoint.reset(params,function cb(err, respData) {
    callback(err,respData);
  });
};




//userProfileEndpoint.userProfile(function () {
//  });