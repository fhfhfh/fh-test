/**
 * NodeJS Module: Encapsulates logic for fetchNews Endpoint.
 *
 */

var http = require('http');
var request = require('request');
var async = require('../lib/async.js');
var sessionManager = require('../lib/session/session.js');
var appConfig = require('../config/appConfig.js')
var jsonUtils = require('../lib/jsonUtils.js');
var constants = require('../config/constants.js');
var respUtils = require("../utils/responseUtils.js");
var log = require('../lib/log/log.js');
const imgFetch = "http://img.youtube.com/vi/{ID}/0.jpg";
const durationFetch = "/feeds/api/videos/{ID}?v=2&prettyprint=true&alt=json";


var fetchNewsEndpoint = function() {

    /**
     * Process fetchNews request.
     */
    // Exposed operations
    this.fetchNews = function fetchNews(reqJson, callback){
        if (jsonUtils.getPath(reqJson, "request.head.sessionId") == null)
        {
            log.error("[fetchNewsEndpoint][fetchNews] >> SessionId Not Available");
            var responseJson = respUtils.constructStatusResponse("fetchNews", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
            return callback(responseJson,null)
        }

        // Extract sessionId from request params
        var sessionId = jsonUtils.getPath(reqJson, "request.head.sessionId").trim();

        //Fetching session details
        sessionManager.getSession(sessionId, function(err, data ){
            log.info("[fetchNewsEndpoint][fetchNews] >> Session Details :"+JSON.stringify(data));
            if(data)
            {
                //Setting the apiSession to fetch the Alert details
                var apiSessionId = data.apiSessionId;

                // preparing the header
                var getHeaders = {
                    'Content-Type' : 'application/json',
                    'sessionId' : apiSessionId
                };
                var env = appConfig.current;

                // perparing the GET options
                var optionsGet = {
                    host : appConfig.environments[env].urls.baseUrl,
                    port : appConfig.environments[env].urls.port,
                    path : appConfig.environments[env].urls.news,
                    method : 'GET',
                    headers : getHeaders
                };

                // doing the HTTP GET call for fetching news data from basic Peachy API.
                var reqGet = http.request(optionsGet, function(res) {

                    if (res.statusCode == 403)
                    {
                        var fail = respUtils.constructStatusResponse("fetchNews", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                        return  callback(fail,null)
                    }
                    else if (res.statusCode == 500)
                    {
                        var fail = respUtils.constructStatusResponse("fetchNews", constants.RESP_SERVER_ERROR, "Internal server error",{});
                        return  callback(fail,null)
                    }
                    else if (res.statusCode == 200)
                    {
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
                                
                                var jsonObj = respUtils.constructStatusResponse("fetchNews", constants.RESP_SUCCESS, "fetchNews Success",jsonObject);
                                initQueue(jsonObj,function finalCallback(res){
                                    callback(null,res);      //callback returning the success response JSON back to client
                                });
                            }
                            else        //if complete data not found
                            {
                                var fail = respUtils.constructStatusResponse("fetchNews", constants.RESP_SERVER_ERROR, "Internal server error",{});
                                return  callback(fail,null)
                            }
                        })
                    }
                    else               //if GET call is not successful
                    {
                        var fail = respUtils.constructStatusResponse("fetchNews", constants.RESP_SERVER_ERROR, "Internal server error",{});
                        return  callback(fail,null)
                    }
                });

                reqGet.end();
                reqGet.on('error', function(e) {
                    log.error("[fetchNewsEndpoint][fetchNews][regGet] >> " + e);
                    var fail = respUtils.constructStatusResponse("fetchNews", constants.RESP_SERVER_ERROR, e,{});
                    return  callback(fail,null)
                });
            }
            else        //If session not found
            {
                var responseJson = respUtils.constructStatusResponse("fetchNews", constants.RESP_AUTH_FAILED, "Authentication  Fail",{});
                return callback(responseJson,null)
            }
        });

    }
    
    function initQueue(jsonObj, finalCallback)
    {
        var finalJson = [];
        var newsObj;
        //initialising Queue
        var q = async.queue(function (task, queueCallBack) {
            var videoUrl = JSON.stringify(task.url);
            var arr = videoUrl.split("/");          //triming the videoId from the url  
            var id, idStr; 
            if(arr.length && arr.length > 0) {
                idStr = arr[arr.length-1];
                id = idStr.substring(0, idStr.length-1);
            }
            var url =  imgFetch.replace("{ID}",id);
            //passing video id to fetch video length
            fetchVideoLength(id,function vidCallback(err,resp){ 
                if(resp!=null)
                    task["videoLength"] = JSON.stringify(resp);  //adding videoLength to the object
                else 
                {
                    log.error("[fetchNewsEndpoint][initQueue] >> Video length not found "+err);
                    task["videoLength"] = "00";
                }
            });
            
            
            //Requesting image from the URL
            request({
                url: url,
                encoding: null
            }, function (err, res, body){
                if (!err && res && res.statusCode == 200) {        
                    var image = body.toString('base64');    //Encoding image into base64 
                    task["videoImgBase64"] = image;         //adding videoImageBase64 into object
                    finalJson.push(task);                   //Pushing complete video object into finalJson
                    queueCallBack();
                } 
                else    //If image request fails
                {
                    log.debug("[fetchNewsEndpoint]"+"[initQueue]>> Image request failed, " + err);
                    queueCallBack(err);
                }
            });
        }, 1);
                                
                                
        q.drain = function()     // Draining Queue 
        {        
            jsonObj.response.payload.News = finalJson;
            return finalCallback(jsonObj);   //callback returning the final JSON including base64 encoded images and video length
        }
          
          
        for (var i=0; i<jsonObj.response.payload.News.length; i++)
        {
            newsObj = jsonObj.response.payload.News[i];
            //Pushing object into the Queue
            q.push(newsObj, function (err) {         
                if(err)     // Error if no URL not found
                    log.error("[fetchNewsEndpoint][fetchNews][regGet] >> No Data To Convert For video "+err);
            });
        }
    }
    
    
    function fetchVideoLength(vidId, vidCallback){
         
        var path = durationFetch.replace("{ID}",vidId); //preparing path  
        // preparing the header
        var getHeaders = {
            'Content-Type' : 'application/json'
        };
        
        // perparing the GET options
        var optionsGet = {
            host :  "gdata.youtube.com",
            port : 80,
            path : path,
            method : 'GET',
            headers : getHeaders
        };

        // doing the HTTP GET call
        var reqGet = http.request(optionsGet, function(res) {

            if (res && res.statusCode == 403)
            {
                var fail = "Internal server error";
                return  callback(fail,null)
            }
            else if (res.statusCode == 500)
            {
                var fail = "Internal server error";
                return  callback(fail,null)
            }
            else if (res.statusCode == 200)
            {
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
                        var mediaContentArr = jsonUtils.getPath(jsonObject, "entry.media$group.media$content");
                        if (mediaContentArr == null && mediaContentArr.length <2)  //checking length till 2 elements because we know that duration is in second element
                        {
                            var fail = "Internal server error";
                            return  vidCallback(fail,null)
                        }
                        //returning the video duration in seconds
                        vidCallback(null,mediaContentArr[1].duration); 
                    }
                    else        //if complete data not found
                    {
                        var fail = "Internal server error";
                        return  vidCallback(fail,null)
                    }
                })
            }
            else               //if GET call is not successful
            {
                var fail = "Internal server error";
                return  vidCallback(fail,null)
            }
        });
        reqGet.end();
        reqGet.on('error', function(e) {
            log.error("[fetchNewsEndpoint][fetchVideoLength][regGet] >> " + e);
            var fail = "Internal server error";
            return  vidCallback(fail,null)
        });
    }
}
module.exports = new fetchNewsEndpoint();