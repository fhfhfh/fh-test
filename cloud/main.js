


// Dependencies: Endpoint Implementations
var loginEndpoint = require("./endpoints/login.js");
var logoutEndpoint =  require("./endpoints/logout.js");
var resetEndpoint = require("./endpoints/reset.js");
var userProfileEndpoint =  require("./endpoints/userProfile.js");
var saveUserProfileEndpoint = require("./endpoints/saveUserProfile.js");
var peachyPointsEndpoint = require("./endpoints/peachyPoints.js")
var medicineCabinetEndpoint = require("./endpoints/medicineCabinetList.js")
var searchMedicineEndpoint = require("./endpoints/searchMedicine.js")
var saveMedicineEndpoint = require("./endpoints/saveMedicine.js")
var delMedicineEndpoint = require("./endpoints/delMedicine.js")
var delMulMedicineEndpoint = require("./endpoints/delMulMedicine.js")
var reminderMedicineEndpoint = require("./endpoints/reminderMedicine.js")
var fetchReminderListEndpoint = require("./endpoints/reminderList.js")
var fetchDiagnosisListEndpoint = require("./endpoints/fetchDiagnosisList.js")
var fetchTestResultListEndpoint = require("./endpoints/fetchTestResultList.js")
var filterContentEndpoint = require("./endpoints/filterContent.js")
var fetchMedicalHistoryEndpoint = require("./endpoints/fetchMedicalHistory.js")
var searchAllergyEndpoint = require("./endpoints/searchAllergy.js")
var addAllergyEndpoint = require("./endpoints/addAllergy.js")
var fetchFeaturedContentEndpoint = require("./endpoints/fetchFeaturedContent.js")
var fetchAlertEndpoint = require("./endpoints/fetchAlert.js")
var fetchQuotesEndpoint = require("./endpoints/fetchQuotes.js")
var fetchVideosEndpoint = require("./endpoints/fetchVideos.js")
var fetchNewsEndpoint = require("./endpoints/fetchNews.js")
var fetchAvatarsEndpoint = require("./endpoints/fetchAvatars.js")


// mock service if not on $fh
if (!process.env.FH_DOMAIN){
  $fh = require('./test/mock/fh');
}


// Supported Actions
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
exports.addReminderAction = addReminderAction;
exports.fetchReminderAction = fetchReminderAction;
exports.fetchTestResultListAction = fetchTestResultListAction;
exports.fetchDiagnosisListAction = fetchDiagnosisListAction;
exports.filterContentAction = filterContentAction;
exports.fetchMedicalHistoryAction = fetchMedicalHistoryAction;
exports.searchAllergyAction = searchAllergyAction;
exports.addAllergyAction = addAllergyAction;
exports.fetchFeaturedContentAction = fetchFeaturedContentAction;
exports.fetchAlertAction = fetchAlertAction;
exports.fetchQuotesAction = fetchQuotesAction;
exports.fetchVideosAction = fetchVideosAction;
exports.fetchNewsAction = fetchNewsAction;
exports.fetchAvatarsAction = fetchAvatarsAction;


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

//--------------------------------------addReminderMedicine----------------------------------------
function addReminderAction(params, callback) {
  console.log(JSON.stringify(params));
  reminderMedicineEndpoint.addRem(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------addReminderMedicine----------------------------------------
function fetchReminderAction(params, callback) {
  console.log(JSON.stringify(params));
  fetchReminderListEndpoint.fetchReminder(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------Fetch Diagnosis Lis----------------------------------------
function fetchDiagnosisListAction(params, callback) {
  console.log(JSON.stringify(params));
  fetchDiagnosisListEndpoint.fetchDiagnosis(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------Fetch Test Result List-----------------------------------------
function fetchTestResultListAction(params, callback) {
  console.log(JSON.stringify(params));
  fetchTestResultListEndpoint.fetchTestResult(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------Filter Content-------------------------------------------------
function filterContentAction(params, callback) {
  console.log(JSON.stringify(params));
  filterContentEndpoint.filterContent(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------medicalHistory--------------------------------------------------
function fetchMedicalHistoryAction(params, callback) {
  console.log(JSON.stringify(params));
  fetchMedicalHistoryEndpoint.fetchMedicalHistory(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------searchAllergy--------------------------------------------------

function searchAllergyAction(params, callback) {
  console.log(JSON.stringify(params));
  searchAllergyEndpoint.searchAllergy(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------addAllergy--------------------------------------------------

function addAllergyAction(params, callback) {
  console.log(JSON.stringify(params));
  addAllergyEndpoint.addAllergy(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------fetchFeaturedContent--------------------------------------------------

function fetchFeaturedContentAction(params, callback) {
  console.log(JSON.stringify(params));
  fetchFeaturedContentEndpoint.fetchFeaturedContent(params,function cb(err, respData) {
    callback(err,respData);
  });
}



//---------------------------------------fetchAlerts--------------------------------------------------------------------

function fetchAlertAction(params, callback) {
  console.log(JSON.stringify(params));
  fetchAlertEndpoint.fetchAlert(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchQuotes--------------------------------------------------------------------

function fetchQuotesAction(params, callback) {
  console.log(JSON.stringify(params));
  fetchQuotesEndpoint.fetchQuotes(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchVideos--------------------------------------------------------------------

function fetchVideosAction(params, callback) {
  console.log(JSON.stringify(params));
  fetchVideosEndpoint.fetchVideos(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchNews--------------------------------------------------------------------

function fetchNewsAction(params, callback) {
  console.log(JSON.stringify(params));
  fetchNewsEndpoint.fetchNews(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchAvatars--------------------------------------------------------------------

function fetchAvatarsAction(params, callback) {
  console.log(JSON.stringify(params));
  fetchAvatarsEndpoint.fetchAvatars(params,function cb(err, respData) {
    callback(err,respData);
  });
}
