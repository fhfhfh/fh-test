/**
 * NodeJS Module: Encapsulates logic for createDB Endpoint.
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

var createCKEndpoint = function() {

    /**
     * Process createDB request.
     */
    // Exposed operations
    this.createDB = function createDB(reqJson, callback) {

        // if (jsonUtils.getPath(reqJson, "request.head.sessionId") === null) {
        //     log.error("[createCKEndpoint][createDB] >> SessionId Not Available");
        //     var responseJson = respUtils.constructStatusResponse("createDB", constants.RESP_AUTH_FAILED, "Authentication  Fail", {});
        //     return callback(responseJson, null);
        // }

        // // Extract sessionId from request params
        // var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();
        // var sessionId = "abcd";
        // //Fetching session details
        // sessionManager.getSession(sessionId, function(err, data) {
        //     log.info("[createCKEndpoint][createDB] >> Session Details :" + JSON.stringify(data));
        //     if (data) {
        var rec = "";
        //view a data record for entity 
        $fh.db({
            "act": "list",
            "type": "CalorieKing_DB"
        }, function(err, data) {

            if (err) {
                log.error("[deleteCKEndpoint][" + "deleteCK" + "][deleteAll][list] >> " + err);
            } else {
                rec = data.list;
                if (rec.length <= 0) {
                    log.info("[deleteCKEndpoint][deleteCK][DeleteAll] >> No Records to delete :");
                }
                for (var i = 0; i < rec.length; i++) {
                    $fh.db({
                        "act": "delete",
                        "type": "CalorieKing_DB",
                        "guid": rec[i].guid
                    }, function(err, data) {
                        if (err) {
                            log.error("[deleteCKEndpoint][" + "deleteCK" + "][deleteAll] >> " + err);

                        } else {
                            var jsonObj = respUtils.constructStatusResponse("deleteCK", constants.RESP_SUCCESS, "Record Deleted Successfully ", {});
                            log.debug("[deleteCKEndpoint][deleteCK][DeleteAll]  Record Deleted Successfully :");
                        }

                    });
                }
            }
            //     }
            // });
            console.log("Beginning Creating DB");
            fs.readFile('./cloud/CalorieKingDB/catJSON.txt', function(err, res) {
                if (err) {
                    console.log("Error reading json file : ", err);
                    return;
                }
                var data = JSON.parse(res);
                var flag;
                for (var i = 0; i < data.Food.length; i++) {
                    var dataChunk = data.Food[i];
                    $fh.db({
                        "act": "create",
                        "type": "CalorieKing_DB",
                        "fields": dataChunk
                    }, function(err, data) {
                        if (err) {
                            log.error("[createDBEndpoint][createDB][add] >> Failed to Add Record: " + err);
                        } else {
                            var jsonObj = respUtils.constructStatusResponse("createDB", constants.RESP_SUCCESS, "Record Added Successfully", data);
                            log.info("[createDBEndpoint][createDB][add] >> Record Added Successfully   ");
                        }
                    });
                }
                var res = respUtils.constructStatusResponse("createDB", constants.RESP_SUCCESS, "Records Added Successfully", {});
                callback(null, res);
            });
            // } else //If session not found
            // {
            //     var responseJson = respUtils.constructStatusResponse("createDB", constants.RESP_AUTH_FAILED, "Authentication  Fail", {});
            //     return callback(responseJson, null);
            // }
            // }
        });
    };
};
// };
module.exports = new createCKEndpoint();