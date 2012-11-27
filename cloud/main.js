
// Dependencies: Endpoint Implementations
var loginEndpoint = require("endpoints/login.js");
var logoutEndpoint =  require("endpoints/logout.js");
var resetEndpoint = require("endpoints/reset.js");
var userProfileEndpoint =  require("endpoints/userProfile.js");
var saveUserProfileEndpoint = require("endpoints/saveUserProfile.js");
var peachyPointsEndpoint = require("endpoints/peachyPoints.js")
var medicineCabinetEndpoint = require("endpoints/medicineCabinetList.js")
var searchMedicineEndpoint = require("endpoints/searchMedicine.js")
var saveMedicineEndpoint = require("endpoints/saveMedicine.js")
var delMedicineEndpoint = require("endpoints/delMedicine.js")
var delMulMedicineEndpoint = require("endpoints/delMulMedicine.js")



exports.loginAction = loginAction;
exports.logoutAction = logoutAction;
exports.resetAction = resetAction;
exports.userProfileAction = userProfileAction;
exports.saveUserProfileAction = saveUserProfileAction;
exports.peachyPointsAction = peachyPointsAction;
exports.medicineCabinetAction = medicineCabinetAction;
exports.searchMedicineAction = searchMedicineAction;
exports.saveMedicineAction = saveMedicineAction;
exports.delMedicineAction = delMedicineAction;
exports.delMulMedicineAction = delMulMedicineAction;

//--------------------------------------login----------------------------------------
function loginAction(params, callback) {
  console.log(JSON.stringify(params));
  loginEndpoint.login(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//-------------------------------------logout----------------------------------------

function logoutAction(params, callback) {
  console.log(JSON.stringify(params));
  logoutEndpoint.logout(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------reset----------------------------------------
function resetAction(params, callback) {
  console.log(JSON.stringify(params));
  resetEndpoint.reset(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//------------------------------------userProfile----------------------------------------

function userProfileAction(params, callback) {
  console.log(JSON.stringify(params));
  userProfileEndpoint.userProfile(params,function cb(err, respData) {
    callback(err,respData);
  });
}
//----------------------------------saveUserProfile---------------------------------------


function saveUserProfileAction(params, callback) {
  console.log(JSON.stringify(params));
  saveUserProfileEndpoint.sup(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//----------------------------------peachyPoint------------------------------------------


function peachyPointsAction(params, callback) {
  console.log(JSON.stringify(params));
  peachyPointsEndpoint.peachyPoints(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//----------------------------------medicineCabinetList------------------------------------------


function medicineCabinetAction(params, callback) {
  console.log(JSON.stringify(params));
  medicineCabinetEndpoint.medicineCabinet(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------searchMedicine----------------------------------------
function searchMedicineAction(params, callback) {
  console.log(JSON.stringify(params));
  searchMedicineEndpoint.searchMedicine(params,function cb(err, respData) {
    callback(err,respData);
  });
}



//--------------------------------------savemedicine----------------------------------------
function saveMedicineAction(params, callback) {
  console.log(JSON.stringify(params));
  saveMedicineEndpoint.saveMedicine(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------deleteSinglemedicine----------------------------------------
function delMedicineAction(params, callback) {
  console.log(JSON.stringify(params));
  delMedicineEndpoint.delMedicine(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------deleteMultipleMedicine----------------------------------------
function delMulMedicineAction(params, callback) {
  console.log(JSON.stringify(params));
  delMulMedicineEndpoint.delMulMedicine(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//userProfileEndpoint.userProfile(function () {
//  });sup3rhighw@y   medicineCabinetAction