


// Dependencies: Endpoint Implementations
var loginEndpoint = require("./endpoints/login.js");
var logoutEndpoint =  require("./endpoints/logout.js");
var resetEndpoint = require("./endpoints/reset.js");
var userProfileEndpoint =  require("./endpoints/userProfile.js");
var saveUserProfileEndpoint = require("./endpoints/updateProfile.js");
var peachyPointsEndpoint = require("./endpoints/peachyPoints.js");
var medicineCabinetEndpoint = require("./endpoints/medicineCabinetList.js");
var searchMedicineEndpoint = require("./endpoints/searchMedicine.js");
var saveMedicineEndpoint = require("./endpoints/saveMedicine.js");
var delMedicineEndpoint = require("./endpoints/delMedicine.js");
var delMulMedicineEndpoint = require("./endpoints/delMulMedicine.js");
var reminderMedicineEndpoint = require("./endpoints/reminderMedicine.js");
var fetchReminderListEndpoint = require("./endpoints/reminderList.js");
var fetchDiagnosisListEndpoint = require("./endpoints/fetchDiagnosisList.js");
var fetchTestResultListEndpoint = require("./endpoints/fetchTestResultList.js");
var filterContentEndpoint = require("./endpoints/filterContent.js");
var fetchMedicalHistoryEndpoint = require("./endpoints/fetchMedicalHistory.js");
var searchAllergyEndpoint = require("./endpoints/searchAllergy.js");
var addAllergyEndpoint = require("./endpoints/addAllergy.js");
var fetchFeaturedContentEndpoint = require("./endpoints/fetchFeaturedContent.js");
var fetchAlertEndpoint = require("./endpoints/fetchAlert.js");
var fetchQuotesEndpoint = require("./endpoints/fetchQuotes.js");
var fetchNewsEndpoint = require("./endpoints/fetchNews.js");
var fetchAvatarsEndpoint = require("./endpoints/fetchAvatars.js");
var fetchProblemsEndpoint = require("./endpoints/fetchProblems.js");
var fetchAllergiesEndpoint = require("./endpoints/fetchAllergies.js");
var fetchSocialHistoryEndpoint = require("./endpoints/fetchSocialHistory.js");
var fetchFamilyHistoryEndpoint = require("./endpoints/fetchFamilyHistory.js");
var fetchProceduresEndpoint = require("./endpoints/fetchProcedures.js");
var fetchImmunizationsEndpoint = require("./endpoints/fetchImmunization.js");
var fetchEncountersEndpoint = require("./endpoints/fetchEncounters.js");
var fetchVitalsignsEndpoint = require("./endpoints/fetchVitalsigns.js");
var fetchResultsEndpoint = require("./endpoints/fetchResults.js");
var healthHubEndpoint = require("./endpoints/healthHub.js");
var folderManagerEndpoint = require("./endpoints/folderManager.js");
var createCKEndpoint = require("./endpoints/CKdb_create.js");
var fetchCKEndpoint = require("./endpoints/fetchCKdb.js");
var deleteCKEndpoint = require("./endpoints/deleteCKdb.js");
var searchCKEndpoint = require("./endpoints/searchCKdb.js");
var fetchActivityEndpoint = require("./endpoints/fetchActivity");

var dbParser = require("./dbparser.js");


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
exports.fetchNewsAction = fetchNewsAction;
exports.fetchAvatarsAction = fetchAvatarsAction;
exports.fetchProblemsAction = fetchProblemsAction;
exports.fetchAllergiesAction = fetchAllergiesAction;
exports.fetchSocialHistoryAction = fetchSocialHistoryAction;
exports.fetchFamilyHistoryAction = fetchFamilyHistoryAction;
exports.fetchProceduresAction = fetchProceduresAction;
exports.fetchImmunizationsAction = fetchImmunizationsAction;
exports.fetchEncountersAction = fetchEncountersAction;
exports.fetchVitalsignsAction = fetchVitalsignsAction;
exports.fetchResultsAction = fetchResultsAction;
exports.healthHubAction = healthHubAction;
exports.folderManagerAction = folderManagerAction;
exports.dbParse = dbParse;
exports.createDBAction = createDBAction;
exports.fetchDBAction = fetchDBAction;
exports.deleteCKAction = deleteCKAction;
exports.searchDBAction = searchDBAction;
exports.fetchActivityAction = fetchActivityAction;
exports.searchActivityAction = searchActivityAction;
exports.saveJournalAction = saveJournalAction;

//--------------------------------------login----------------------------------------
function loginAction(params, callback) {
  loginEndpoint.login(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//-------------------------------------logout----------------------------------------

function logoutAction(params, callback) {
  logoutEndpoint.logout(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------reset----------------------------------------
function resetAction(params, callback) {
  resetEndpoint.reset(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//------------------------------------userProfile----------------------------------------

function userProfileAction(params, callback) {
  userProfileEndpoint.userProfile(params,function cb(err, respData) {
    callback(err,respData);
  });
}
//----------------------------------saveUserProfile---------------------------------------


function saveUserProfileAction(params, callback) {
  //console.log(JSON.stringify(params));
  saveUserProfileEndpoint.saveUserProfile(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//----------------------------------peachyPoint------------------------------------------


function peachyPointsAction(params, callback) {
  peachyPointsEndpoint.peachyPoints(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//----------------------------------medicineCabinetList------------------------------------------


function medicineCabinetAction(params, callback) {
  medicineCabinetEndpoint.medicineCabinet(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------searchMedicine----------------------------------------
function searchMedicineAction(params, callback) {
  searchMedicineEndpoint.searchMedicine(params,function cb(err, respData) {
    callback(err,respData);
  });
}



//--------------------------------------savemedicine----------------------------------------
function saveMedicineAction(params, callback) {
  saveMedicineEndpoint.saveMedicine(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------deleteSinglemedicine----------------------------------------
function delMedicineAction(params, callback) {
  delMedicineEndpoint.delMedicine(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------deleteMultipleMedicine----------------------------------------
function delMulMedicineAction(params, callback) {
  delMulMedicineEndpoint.delMulMedicine(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------addReminderMedicine----------------------------------------
function addReminderAction(params, callback) {
  reminderMedicineEndpoint.addRem(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------addReminderMedicine----------------------------------------
function fetchReminderAction(params, callback) {
  fetchReminderListEndpoint.fetchReminder(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------Fetch Diagnosis Lis----------------------------------------
function fetchDiagnosisListAction(params, callback) {
  fetchDiagnosisListEndpoint.fetchDiagnosis(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------Fetch Test Result List-----------------------------------------
function fetchTestResultListAction(params, callback) {
  fetchTestResultListEndpoint.fetchTestResult(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------Filter Content-------------------------------------------------
function filterContentAction(params, callback) {
  filterContentEndpoint.filterContent(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------medicalHistory--------------------------------------------------
function fetchMedicalHistoryAction(params, callback) {
  fetchMedicalHistoryEndpoint.fetchMedicalHistory(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------searchAllergy--------------------------------------------------

function searchAllergyAction(params, callback) {
  searchAllergyEndpoint.searchAllergy(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//--------------------------------------addAllergy--------------------------------------------------

function addAllergyAction(params, callback) {
  addAllergyEndpoint.addAllergy(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//--------------------------------------fetchFeaturedContent--------------------------------------------------

function fetchFeaturedContentAction(params, callback) {
  fetchFeaturedContentEndpoint.fetchFeaturedContent(params,function cb(err, respData) {
    callback(err,respData);
  });
}



//---------------------------------------fetchAlerts--------------------------------------------------------------------

function fetchAlertAction(params, callback) {
  fetchAlertEndpoint.fetchAlert(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchQuotes--------------------------------------------------------------------

function fetchQuotesAction(params, callback) {
  fetchQuotesEndpoint.fetchQuotes(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//---------------------------------------fetchNews--------------------------------------------------------------------

function fetchNewsAction(params, callback) {
  fetchNewsEndpoint.fetchNews(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchAvatars--------------------------------------------------------------------

function fetchAvatarsAction(params, callback) {
  fetchAvatarsEndpoint.fetchAvatars(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//---------------------------------------fetchAllergies--------------------------------------------------------------------

function fetchAllergiesAction(params, callback) {
  fetchAllergiesEndpoint.fetchAllergies(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchSocialHistory--------------------------------------------------------------------

function fetchSocialHistoryAction(params, callback) {
 fetchSocialHistoryEndpoint.fetchSocialHistory(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//---------------------------------------fetchNews--------------------------------------------------------------------

function fetchFamilyHistoryAction(params, callback) {
  fetchFamilyHistoryEndpoint.fetchFamilyHistory(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchAvatars--------------------------------------------------------------------

function fetchProceduresAction(params, callback) {
  fetchProceduresEndpoint.fetchProcedures(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchProblems--------------------------------------------------------------------

function fetchProblemsAction(params, callback) {
  fetchProblemsEndpoint.fetchProblems(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchEncounters--------------------------------------------------------------------

function fetchEncountersAction(params, callback) {
  fetchEncountersEndpoint.fetchEncounters(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchImmunization--------------------------------------------------------------------

function fetchImmunizationsAction(params, callback) {
  fetchImmunizationsEndpoint.fetchImmunizations(params,function cb(err, respData) {
    callback(err,respData);
  });
}


//---------------------------------------fetchVitalsigns--------------------------------------------------------------------

function fetchVitalsignsAction(params, callback) {
  fetchVitalsignsEndpoint.fetchVitalsigns(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------fetchResults--------------------------------------------------------------------

function fetchResultsAction(params, callback) {
  fetchResultsEndpoint.fetchResults(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------healthHub--------------------------------------------------------------------

function healthHubAction(params, callback) {
  healthHubEndpoint.healthHub(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------folderManager--------------------------------------------------------------------

function folderManagerAction(params, callback) {
 folderManagerEndpoint.folderManager(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//-------------------------------------DB Parse function--------------------------------------------

function dbParse(params, callback){
  dbParser.parseDB(function(){
    callback(null, {status: "OK"});
  });
}
 //---------------------------------------createDB--------------------------------------------------------------------

function createDBAction(params, callback) {
  //console.log(JSON.stringify(params));
  createCKEndpoint.createDB(params,function cb(err, respData) {
    callback(err,respData);
  });
}


 //---------------------------------------fetchDB--------------------------------------------------------------------

function fetchDBAction(params, callback) {
  //console.log(JSON.stringify(params));
  fetchCKEndpoint.fetchCK(params,function cb(err, respData) {
    callback(err,respData);
  });
}

 //---------------------------------------deleteDB--------------------------------------------------------------------

function deleteCKAction(params, callback) {
  //console.log(JSON.stringify(params));
  deleteCKEndpoint.deleteCK(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------searchDB--------------------------------------------------------------------

function searchDBAction(params, callback) {

  searchCKEndpoint.searchCK(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//-------------------------------------- fetchActivityAction---------------------------------------------------------

function fetchActivityAction(params, callback){
  fetchActivityEndpoint.fetchData(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//---------------------------------------searchActivity--------------------------------------------------------------------

function searchActivityAction(params, callback) {

  fetchActivityEndpoint.searchData(params,function cb(err, respData) {
    callback(err,respData);
  });
}

//-------------------------------------- saveJournal Action----------------------------------------------------------
// save the users food journal to peachy backend
function saveJournalAction(params, callback){
  // for ashish to implement
  return callback(null, {response: {payload: {status: "OK"}}});
}


