var http = require('http');
var request = require('request');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
var appConfig = require('../config/appConfig.js')

var RequestsUtil = function() {

    // Public Functions
    this.makeRequestCall = makeRequestCall;
    
    function makeRequestCall(requestJson,callback) {
        
       
        // preparing the header
        var createHeaders = {
            'Content-Type' : 'application/json',
            'sessionId' : requestJson.apiSessionId
        };
         
        
        var env = appConfig.current;
        
        // perparing the GET/POST/PUT options
        var options = {
            host : appConfig.environments[env].urls.baseUrl,
            port : appConfig.environments[env].urls.port,
            path : appConfig.environments[env].urls[requestJson.path],
            method :  requestJson.method,
            headers : createHeaders
        };
        
        //Making the http request
        var reqGet = http.request(options, function(res) {
            
            if (res.statusCode == 403)
            {
                var fail = respUtils.constructStatusResponse(requestJson.EndPointName, constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                log.error("["+requestJson.EndPointName+"] >> [makeRequestCall] - HTTP response Status 403 received");
                return  callback(fail,null) 
            }
            else if (res.statusCode == 404)
            {
//                   console.log("\n\n HERE--- \n\n"+res.statusCode);
                var fail = respUtils.constructStatusResponse(requestJson.EndPointName, constants.RESP_AUTH_FAILED, "Data Not Found",{});
                log.error("["+requestJson.EndPointName+"] >> [makeRequestCall] - HTTP response Status 404 received >> Data Not Found");
                return  callback(fail,null) 
            }
             else if (res.statusCode == 401)
            {
//                   console.log("\n\n HERE--- \n\n"+res.statusCode);
                var fail = respUtils.constructStatusResponse(requestJson.EndPointName, constants.RESP_AUTH_FAILED, "Data Not Found",{});
                log.error("["+requestJson.EndPointName+"] >> [makeRequestCall] - HTTP response Status 401 received >> Unauthorized Access");
                return  callback(fail,null) 
            }
            else if (res.statusCode == 500)
            {
                var fail = respUtils.constructStatusResponse(requestJson.EndPointName, constants.RESP_SERVER_ERROR, "Internal server error",{});
                log.error("["+requestJson.EndPointName+"] >> [makeRequestCall] - HTTP response Status 500 received");
                return  callback(fail,null) 
            }
            else if (res.statusCode == 200)
            {                    
                log.debug("["+requestJson.EndPointName+"Endpoint] >> [makeRequestCall] - HTTP response Status 200 SUCCESS");
                 if(requestJson.EndPointName == "login")
                        return callback(null,res);
                var data="";
                res.on('data', function(d) {
                    //fetching the complete response that comes in chunks in 'data'
                    data+=d;
                });
                res.on('end',function(){
                   
                    if(data!="")
                    {
                        //converting the response data into JSON object
                        var jsonObject= JSON.parse(data.toString());
                        var jsonObj = respUtils.constructStatusResponse(requestJson.EndPointName, constants.RESP_SUCCESS, requestJson.EndPointName+" Success",jsonObject);
                        callback(null,jsonObj);      //callback returning the success response JSON back 
                    }
                    else        //if complete data not found
                    {
                       
                        var fail = respUtils.constructStatusResponse(requestJson.EndPointName, constants.RESP_SERVER_ERROR, "Internal server error",{});
                        return  callback(fail,null)
                    }
                })
            }
            else               //if GET call is not successful
            {
//                 console.log("\n\n HERE--- \n\n"+res.statusCode);
                var fail = respUtils.constructStatusResponse(requestJson.EndPointName, constants.RESP_SERVER_ERROR, "Internal server error",{});
                return  callback(fail,null)
            }
        });
        var params = ""+JSON.stringify(requestJson.jsonObj);
        reqGet.write(params);
        reqGet.end();
        reqGet.on('error', function(e) {
            log.error("["+requestJson.EndPointName+"Endpoint]["+requestJson.EndPointName+"][regGet] >> " + e);
            var fail = respUtils.constructStatusResponse(requestJson.EndPointName, constants.RESP_SERVER_ERROR, e,{});
            return  callback(fail,null)
        });
    }
}; // End Class RequestUtils

// Export Module
module.exports = new RequestsUtil();



