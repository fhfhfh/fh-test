/**
 * NodeJS Module: Encapsulates logic for fetchQuotes Endpoint.
 * 
 */
var http = require('http');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var log = require('../lib/log/log.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var reqUtils = require("../utils/requestUtils.js");


var fetchQuotesEndpoint = function() {
    /**
     * Process fetchQuotes request.
     */
    // Exposed operations
    this.fetchQuotes = function fetchQuotes(reqJson, callback){
        log.debug("[fetchQuotesEndpoint] >> [fetchQuotes] - STARTS");
        if (reqJson == null)
        {
            var fail = respUtils.constructStatusResponse("fetchQuotes", constants.RESP_SERVER_ERROR, "Internal server error",{});
            return  callback(fail,null) 
        }
        var requestJson = {
            EndPointName : "fetchQuotes",
            path : "quotes",
            apiSessionId : "",   
            method : "GET"
        }
        // Calling respJson function to make request and getting final response
        var respJson = reqUtils.makeRequestCall(requestJson, function(err,res){
            if(res != null){
                callback(null,res);      //callback returning the success response JSON back to client
            }
            else{
                return  callback(err,null);
            }
        });
        
    }
}
module.exports = new fetchQuotesEndpoint();