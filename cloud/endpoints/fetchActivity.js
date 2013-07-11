/**
 * NodeJS Module: Encapsulates logic for fetchData Endpoint.
 * 
 */

var request = require('request');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js');
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");


// Fetch Activities
fetchData = function (reqJson, callback){

    if (jsonUtils.getPath(reqJson, "request.head.sessionId") === null)
    {
        log.error("[fetchActivity][fetchData] >> SessionId Not Available");
        var responseJson = respUtils.constructStatusResponse("fetchActivity", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
        return callback(responseJson,null);
    }

    // Extract sessionId from request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();

    log.info("SessionId >> ", sessionId);
    //Fetching session details
    sessionManager.getSession(sessionId, function(err, data ){
        log.info('DATA >> ', data);
        log.info("[fetchActivity][fetchData] >> Session Details :"+JSON.stringify(data));
        if(data)
        //Fetching data from FH database for Calorie King
        {
            var requestJson = {
                EndPointName : "fetchActivities",
                path : "activities",
                apiSessionId : data.apiSessionId,
                method :"GET"
            };
            var respJson = reqUtils.makeRequestCall(requestJson, function(err,res){
                if(res !== null){
                    // filter by sub activity type  subCategoryId
                    var list = res.response.payload.activities;
                    var arr = [];
                    var subId = typeID[reqJson.request.payload.type];

                    for(var i=0;i<list.length;i++){
                        var item = list[i];
                        if(item.subCategoryId == subId){
                            arr.push(item);
                        }
                    }
                    res.response.payload.activities = arr;
                    delete res.response.payload.activitySubCategories;
                    delete res.response.payload.activityCategories;
                    callback(null,res);
                }
                else{
                    return  callback(err,null);
                }
            });
        }
        else        //If session not found
        {
            var responseJson = respUtils.constructStatusResponse("fetchData", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) ;
        }
    });
};


// Search Ativity
searchData = function(reqJson, callback){
    if (jsonUtils.getPath(reqJson, "request.head.sessionId") === null)
    {
        log.error("[fetchActivity][fetchData] >> SessionId Not Available");
        var responseJson = respUtils.constructStatusResponse("fetchActivity", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
        return callback(responseJson,null);
    }

    // Extract sessionId from request params
    var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();

    //Fetching session details
    sessionManager.getSession(sessionId, function(err, data ){
        log.info("[fetchActivity][fetchData] >> Session Details :"+JSON.stringify(data));
        if(data)
        //Fetching data from FH database for Calorie King
        {
            var requestJson = {
                EndPointName : "fetchActivities",
                path : "activities",
                apiSessionId : data.apiSessionId,
                method :"GET"
            };
            var respJson = reqUtils.makeRequestCall(requestJson, function(err,res){
                if(res !== null){
                    // filter by sub activity type  subCategoryId
                    var term = reqJson.request.payload.term;
                    var list = res.response.payload.activities;
                    var arr = [];
                    var cat = catId[reqJson.request.payload.type];


                    for(var i=0;i<list.length;i++){
                        var item = list[i];

                        if(cat ===99){ // if ALL is selected as a category
                            if(item.activity.toLowerCase().indexOf(term) != -1){
                                arr.push(item);
                            }
                        }
                        else if(item.categoryId == cat){
                            if(item.activity.toLowerCase().indexOf(term) != -1){
                                arr.push(item);
                            }
                        }
                    }
                    res.response.payload.activities = arr;
                    delete res.response.payload.activitySubCategories;
                    delete res.response.payload.activityCategories;
                    callback(null,res);
                }
                else{
                    return  callback(err,null);
                }
            });
        }
        else        //If session not found
        {
            var responseJson = respUtils.constructStatusResponse("fetchData", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) ;
        }
    });
};

var typeID = {
    Ball            : 12,
    Childcare       : 1,
    Combat          : 4,
    Court           : 17,
    DanceSport      : 13,
    DanceArt        : 10,
    EverythingSport : 14,
    EverythingCardio: 18,
    Flexibility     : 5,
    Gym             : 19,
    GymSpecific     : 6,
    Household       : 2,
    LandAir         : 8,
    ManualLabour    : 7,
    OtherWork       : 3,
    OtherDance      : 11,
    Running         : 20,
    WaterCardio     : 21,
    WaterSport      : 15,
    WaterOutdoor    : 9,
    Winter          : 16
};

var catId = {
    all     :99,
    Cardio  :8,
    Combat  :3,
    DanceArt:6,
    Outdoor :5,
    Sports  :7,
    Strength:4,
    Work    :2
};

exports.fetchData = fetchData;
exports.searchData= searchData;




