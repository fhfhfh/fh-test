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
        var getHeaders = {
            'Content-Type' : 'application/json'
        };
        var env = appConfig.current;
  
        // perparing the GET options
        var optionsGet = {
            host : appConfig.environments[env].urls.baseUrl,
            port : appConfig.environments[env].urls.port,
            path : appConfig.environments[env].urls.quotes,
            method : 'GET',
            headers : getHeaders
        };

        log.debug("[fetchQuotesEndpoint] >> [fetchQuotes] - Making request....");
        var reqGet = http.request(optionsGet, function(res) {
            if (res.statusCode == 403)
            {
                var fail = respUtils.constructStatusResponse("fetchQuotes", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                log.debug("[fetchQuotesEndpoint] >> [fetchQuotes] - HTTP response Status 403 received");
                return  callback(fail,null) 
            }
            else if (res.statusCode == 500)
            {
                var fail = respUtils.constructStatusResponse("fetchQuotes", constants.RESP_SERVER_ERROR, "Internal server error",{});
                log.debug("[fetchQuotesEndpoint] >> [fetchQuotes] - HTTP response Status 500 received");
                return  callback(fail,null) 
            }
            else if (res.statusCode == 200)
            {                    
                log.debug("[fetchQuotesEndpoint] >> [fetchQuotes] - HTTP response Status 200 SUCCESS");
                var data="";
                res.on('data', function(d) {
                    //fetching the complete response that comes in chunks in 'data'
                    data+=d; 
                });
                res.on('end',function(){
                    log.debug("[fetchQuotesEndpoint] >> [fetchQuotes] - HTTP response ENDS");
                    if(data)
                    {
                        var jsonObject;
                        //converting the response data into JSON object
                        jsonObject= JSON.parse(data.toString());
                        var jsonObj = respUtils.constructStatusResponse("fetchQuotes", constants.RESP_SUCCESS, "fetchQuotes Success",jsonObject);
                        log.debug("[fetchQuotesEndpoint] >> [fetchQuotes] - Preparing HTTP SUCESS response");
                        return callback(null,jsonObj) //callback returning the response JSON back to client 
                    }
                    else        //if complete data not found
                    {
                        var fail = respUtils.constructStatusResponse("fetchQuotes", constants.RESP_SERVER_ERROR, "Internal server error",{});
                        log.debug("[fetchQuotesEndpoint] >> [fetchQuotes] - Preparing HTTP FAILURE response");
                         return  callback(fail,null) 
                    }
                })
            }
            else               //if GET call is not successful  
            {
                var fail = respUtils.constructStatusResponse("fetchQuotes", constants.RESP_SERVER_ERROR, "Internal server error",{});
                log.debug("[fetchQuotesEndpoint] >> [fetchQuotes] - if GET call is not successful");
                return  callback(fail,null) 
            }
        });
 
        reqGet.end();
        reqGet.on('error', function(e) {
            log.error("[fetchQuotesEndpoint][fetchQuotes][regGet] >> " + e);
            return  callback(fail,null)
        });           
    }
}
module.exports = new fetchQuotesEndpoint();