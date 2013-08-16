var request = require('request');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig');
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require('../utils/responseUtils.js');
var log = require('../lib/log/log.js');
var reqUtils = require('../utils/requestUtils.js');

// save food notebook history

saveData = function(reqJson, callback) {

	if (jsonUtils.getPtath(reqJson, "request.head.session") === null) {
		log.error("[saveFoodJournal][saveData] >> SessionId not Available");
		var responseJson = respUtils.constructStatusResponse("saveFoodJournal", constants.RESP_AUTH_FAILED, "Authentication Fail", {});
		return callback(responseJson, null);
	}

	// extract seesionId from request params
	var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();

	// log.info("SessionId >> ", sessionId);

	// fetching session details
	sessionManager.getSession(sessionId, function(err, data) {
		log.info("[saveFoodJournal][saveData] >> SessionId not available" + JSON.stringify(data));
		// saving users food journal
		if (data) {
			var reqJson = {
				EndPointName: "saveFoodJournal",
				path: "FoodJournal",
				apiSessionId: data.apiSessionId,
				method: "POST",
				data: data
			};

			var respJson = reqUtils.makeRequestCall(reqJson, function(err, res) {
				if (res !== null) {
					// response logic 

					callback(null, res);
				} else {
					return callback(err, null);
				}
				return callback(err, null);
			});
		} else {
			var responseJson = respUtils.constructStatusResponse("saveData", constants.RESP_AUTH_FAILED, "Authentication Fail", {});
			return callback(responseJson, null);
		}

	});


};

exports.saveData = saveData;