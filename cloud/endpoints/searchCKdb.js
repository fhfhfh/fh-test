/**
 * NodeJS Module: Encapsulates logic for searchCK Endpoint.
 *
 */

var http = require('http');
var fs = require('fs');
var async = require('../lib/async.js');
var request = require('request');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js');
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
var reqUtils = require("../utils/requestUtils.js");


/**
 * Process searchCK request.
 */
var searchCKEndpoint = function() {

    // Exposed operations
    this.searchCK = function searchCK(reqJson, callback) {

        if (jsonUtils.getPath(reqJson, "request.head.sessionId") === null) {
            log.error("[searchCKEndpoint][searchCK] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("searchCK", constants.RESP_AUTH_FAILED, "Authentication  Fail", {});
            return callback(responseJson, null);
        }

        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();

        //searching session details
        sessionManager.getSession(sessionId, function(err, data) {
            // console.log("!!!", err.response.payload.status);
            log.info("[searchCKEndpoint][searchCK] >> Session Details :" + JSON.stringify(data));
            if (data)
            //searching data from FH database for Calorie King
            {
                // console.log("!!!", data); // undefined!!!
                if (jsonUtils.getPath(reqJson, "request.payload.type") === null) {
                    log.error("[searchCKEndpoint][searchCK] >> Calorie King Category not provided");
                    var responseJson = respUtils.constructStatusResponse("searchCK", constants.RESP_AUTH_FAILED, "Calorie King Category not provided", {});
                    return callback(responseJson, null);
                }
                console.log(reqJson.request.payload.category);
                console.log(reqJson.request.payload.type);
                var actObj = {
                    "act": "list",
                    "type": "CalorieKing_DB",
                    "eq": {
                        "Name": reqJson.request.payload.category || null
                    }
                };
                if (reqJson.request.payload.category === 'all') {
                    delete actObj['eq'];
                }
                console.log("**********************************");
                console.log("**********************************");
                console.log(actObj);
                console.log("**********************************");
                console.log("**********************************");

                $fh.db(actObj,
                    function(err, data) {
                        console.log("<<<<<", data);
                        if (err) {
                            var fail = respUtils.constructStatusResponse("searchCK", constants.RESP_SERVER_ERROR, err, {});
                            log.error("[searchCKEndpoint][" + "searchCK" + "][READ DATA] >> " + err);
                            return callback(fail, null);

                        } else {


                            if (!data.list.length) {
                                var fail = respUtils.constructStatusResponse("searchCK", constants.RESP_NOT_FOUND, "No Records Found", {});
                                log.error("[searchCKEndpoint][" + "searchCK" + "][READ DATA] >> No Records Found");
                                return callback(fail, null);
                            } else {
                                var result = search(data, reqJson);
                                var jsonObj = respUtils.constructStatusResponse("searchCK", constants.RESP_SUCCESS, "Records searched Successfully", result);
                                return callback(null, jsonObj);
                            }

                        }
                    });
            } else //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("searchCK", constants.RESP_AUTH_FAILED, "Authentication  Fail", {});
                return callback(responseJson, null);
            }
        });
    };
};
module.exports = new searchCKEndpoint();


function search(data, reqJson) {
    var count = 0;
    var dataList = [];
    log.debug("[searchCKEndpoint][searchCK][view] Records fetched Successfully ");
    for (var j = 0; j < data.list.length; j++) {
        var name = data.list[j].fields.Name;
        for (var i = 0; i < data.list[j].fields[name].length; i++) {
            var str = data.list[j].fields[name][i].fullname.toLowerCase(); // list of food types
            // str.toLowerCase(); // parse category to lower case
            var substr = reqJson.request.payload.type.toLowerCase(); // grab search term
            // substr.toLowerCase(); // parse search term to lowerCase

            console.log("search substr:", substr);
            console.log("search str:", str, "\n");

            if (str.indexOf(substr, 0) != -1) {
                dataList.push(data.list[j].fields[name][i]);
                count++;
            }

            // check if string has space b4 1st letter
            var sub = " " + substr;
            if (str.indexOf(sub, 0) > -1) {
                dataList.push(data.list[j].fields[name][i]);
                count++;
            }

            // if (str.indexOf(sub) > -1) {
            //     dataList.push(data.list[j].fields[name][i]);
            //     count++;
            // } else if (str.indexOf(substr) != -1) {
            //     dataList.push(data.list[j].fields[name][i]);
            //     count++;
            // }
        }
    }
    log.debug("[searchCKEndpoint][searchCK][view] Records searched Successfully ");
    console.log("dataList", dataList.name);
    return dataList;
}