/**
 * NodeJS Module: Encapsulates logic for healthHubEndpoint.
 * 
 */
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var async = require('../lib/async.js');
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");


var finalJson = respUtils.constructResponse();

/**
 * Process healthHub request.
 */
var healthHubEndpoint = function() {
    
    // Exposed operations
    this.healthHub = function healthHub(reqJson, callback){
        
        
        
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)         
        {
            log.error("[healthHubEndpoint][healthHub] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("healthHub", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null) 
        }
        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        
        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[healthHubEndpoint][healthHub] >> Session Details :"+JSON.stringify(data));
            if(data)
            {
                var JsonObj = [
                {
                    EndPointName : "fetchImmunizations",
                    path : "immunizations",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "immunizations"

                },
                {
                    EndPointName : "fetchProblems",
                    path : "problems",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "problems"

                },
                {
                    EndPointName : "fetchProcedures",
                    path : "procedures",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "procedures"

                },
                {
                    EndPointName : "fetchAllergies",
                    path : "allergies",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details
                    method : "GET",
                    key : "allergies"

                }
                ];
                
                var jsonObj2 = [
                {
                    EndPointName : "fetchSocialHistory",
                    path : "socialHistory",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "socialHistories"
                },
                {
                    EndPointName : "fetchEncounters",
                    path : "encounters",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "encounters"

                },
                {
                    EndPointName : "fetchFamilyHistory",
                    path : "familyHistory",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "familyHistories"
                },
                {
                    EndPointName : "fetchResults",
                    path : "fetchResults",
                    apiSessionId : data.apiSessionId,
                    method :"GET",
                    key : "results"
                },
                {
                    EndPointName : "fetchVitalsigns",
                    path : "vitalsigns",
                    apiSessionId : data.apiSessionId,   //API sessionId to fetch details from API
                    method : "GET",
                    key : "vitalSigns"
                }
                ];
                
                //ashish : code to optimise later
                initQueue(JsonObj,function finalCallback(resp){
                    initQueue(jsonObj2,function finalCallback(resp2){
                        callback(null,finalJson);      //callback returning the success response JSON back to client
                    });
                });
                
            } 
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("healthHub", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null) 
            }
            
        });           
    };           
}

module.exports = new healthHubEndpoint();
        
        
        
function initQueue(jsonObj, finalCallback)
{
    //initialising Queue
    var q = async.queue(function (task, queueCallBack) {
        var respJson = reqUtils.makeRequestCall(task, function(err,res){
            if(res != null){
                if(res.response.payload[task.key] == "")
                {
                    json(task.EndPointName,function (jsonRes){          //function that returns the hardcoded JSON for the specific endpoint
                        setTimeout(function(){
                            res.response.payload[task.key] = jsonRes;
                            finalJson.response.payload[task.key] = res.response.payload[task.key];
                            return queueCallBack();
                        }, 4000);
                    });
                }
                else
                {
                    finalJson.response.payload[task.key] = res.response.payload[task.key];
                    return queueCallBack();
                }
            }
            else{
                return  queueCallBack(task.EndPointName);
                    
            }
        });
    }, 8);
                                
                                
    q.drain = function()     // Draining Queue 
    {        
        log.info("[healthHubEndpoint][Queue_drain] >>  Draining Queue ");
        return finalCallback(finalJson);   //callback returning the final JSON including base64 encoded images and video length
    }
          
          
    for (var i=0; i<jsonObj.length; i++)
    {
        //Pushing object into the Queue
        q.push(jsonObj[i], function (err) {         
            if(err)   
                log.error("[healthHubEndpoint][initQueue] >> Internal Server Error in  "+err);
        });
    }
}

function json(jsonObj, jsonCallback){
    switch(jsonObj)
    {
        case "fetchImmunizations" :
            return jsonCallback ( [{
                "immunizationId":"1",
                "vaccine":"Influenza virus vaccine IM",
                "date":"12/1/1998 12:00:00 AM",
                "status":"Completed",
                "isNew":"1"
            },

            {
                "immunizationId":"2",
                "vaccine":"Influenza virus vaccineIM",
                "date":"12/1/1999 12:00:00 AM",
                "status":"Completed",
                "isNew":"1"
            },
            ])
        case "fetchProblems" :
            return jsonCallback ([{
                "problemId":"2",
                "problem":"Asthma",
                "description":"Asthma",
                "effectiveDates":"1950",
                "status":"Active",
                "isNew":"1"
            }
            ,
            {
                "problemId":"3",
                "problem":"Pneumonia",
                "description":"Pneumonia",
                "effectiveDates":"1997",
                "status":"Active",
                "isNew":"1"
            }
            ])
                    
        case "fetchProcedures" :
            return jsonCallback ([{
                "procedureId":"1",
                "procedure":"Hip Replacement",
                "description":"Total Hip replacement, left",
                "performedDate":"1998",
                "status":"Completed",
                "isNew":"1"
            }
            ,
            {
                "procedureId":"2",
                "procedure":"Hip Replacement",
                "description":"Total Hip replacement, right",
                "performedDate":"2002",
                "status":"Completed",
                "isNew":"1"
            }
            ])
          
        case "fetchAllergies" :
            return jsonCallback ( [{
                "allergyId":"1",
                "category":"Medication",
                "allergry":"Penicillin",
                "description":"Penicillin",
                "reaction":"Hives",
                "status":"Active",
                "isNew":"1"
            }
            ,
            {
                "allergyId":"2",
                "category":"Medication",
                "allergry":"Aspirin",
                "description":"Aspirin",
                "reaction":"Wheezing",
                "status":"Active",
                "isNew":"1"
            }
            ])
              
        case "fetchSocialHistory" :
            return jsonCallback ([
            {
                "socialHistoryId":"11",
                "socialHistoryElement":"Alcohol Consumption",
                "description":"NONE",
                "EffectDates":"1973 - ",
                "isNew":"1"
            },
            {
                "socialHistoryId":"13",
                "socialHistoryElement":"Cigarette smoking",
                "description":"1 pack per day",
                "EffectDates":"1947 - 1972",
                "isNew":"1"
            }])
                  
        case "fetchEncounters" :
            return jsonCallback ([{
                "encounterId":"1",
                "encounter":"Checkup Examination",
                "location":"Good Health Clinic",
                "ServiceDate":"4/1/2000 12:00:00 AM",
                "isNew":"1"
            }
            ,{
                "encounterId":"2",
                "encounter":"Checkup Examination",
                "location":"Summit Health Clinic",
                "ServiceDate":"4/1/2010 12:00:00 AM",
                "isNew":"1"
            }])
                      
        case "fetchFamilyHistory" :
            return jsonCallback ([{
                "familyHistoryId":"1",
                "familyMember":"Biological father (deceased)",
                "diagnosis":"Myocardial Infarction (cause of death)",
                "ageAtOnset":"57",
                "isNew":"1"
            }
            ,
            {
                "familyHistoryId":"2",
                "familyMember":"Biological father (deceased)",
                "diagnosis":"Hypertension",
                "ageAtOnset":"40",
                "isNew":"1"
            }
            ])
            
        case "fetchResults" :
            return jsonCallback([
            {
                "collectionDate":"12/27/2012 12:00:00 AM",
                "testName":"Glucose",
                "testDescription":"Glucose",
                "result":"87",
                "units":"HG/DL",
                "isAbnormal":"False",
                "minRange":"65",
                "maxRange":"125"
            },
            {
                "collectionDate":"12/27/2012 12:00:00 AM",
                "testName":"Soduim",
                "testDescription":"Soduim",
                "result":"140",
                "units":"HMOL/L",
                "isAbnormal":"True",
                "minRange":"145",
                "maxRange":"150"
            }
            ]
            )
                
        case "fetchVitalsigns" :
            return jsonCallback([
            {
                "date":"01/02/2012",
                "bodyHeight":"177 cm",
                "bodyWeight":"86 kg",
                "diastolicBp":"86 mm[Hg]",
                "systolicBp":"132 mm[Hg]",
                "temperature":"98.6 celsius",
                "heartRate":"",
                "bloodSugar":"",
                "pulseOx":"",
                "breaths":""
            }
            ])

                    
        default :
            return jsonCallback ("");
            
    }
}