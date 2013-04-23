var http = require('http');
var sessionManager = require('./lib/session/session.js');
var appConfig = require('./config/appConfig.js')
var jsonUtils = require('./lib/jsonUtils.js');
var constants = require('./config/constants.js');
var respUtils = require("./utils/responseUtils.js");
var log = require('./lib/log/log.js');
var reqUtils = require("./utils/requestUtils.js");
var fs = require('fs');
	



// Calorie King Database file to create a database on FH cloud
this.createDB = function(callback) {
	
    console.log("Beginning Creating DB");
    fs.readFile('./cloud/CalorieKingDB/conv.json', function(err, res) {
        if (err) {
            console.log("Error reading json file : ", err);
            return;
        }
        var data = JSON.parse(res);
        
        var temp;
        var json = {
            "abc" :[]
        };
        for (var i=0; i<data.a.length;i++)
        {
            json.abc[i] = data.a[i].$;
            var arr = { "temp":[]};
            for(var j=0; j<data.a[i].serving.length;j++){
                if(arr.temp[j] = data.a[i].serving[j].$)
                arr.temp[j] = data.a[i].serving[j].$;
                }
            json.abc[i]["serving"] = arr.temp;
//            arr.temp="";
            
        }
        var sss = JSON.stringify(json,null,4);
        fs.writeFile('./cloud/CalorieKingDB/abc.json', sss, function(err) {
            if (err) {
                console.log('Error writing JSON file: ', err);
                throw err;
            }
            console.log('\nNew JSON file saved!');
            //                            self.updateDB(function() {
            return callback('test');
            //                            });
        });
        //        return callback(null,"ok");
        
        
      
        
        
        //        var temp = data.Food;
        //        $fh.db({
        //            "act": "create",
        //            "type": "CalorieKing",
        //            "fields": data.Food
        //        }, function(err, data) {
        //            if (err) {
        //                var fail = respUtils.constructStatusResponse("createDB", constants.RESP_SERVER_ERROR, err,{});
        //                log.error("[createDBEndpoint]["+"createDB"+"][add] >> " + err);
        //                return callback(fail,null);
        //                
        //            } else {
        //                var jsonObj = respUtils.constructStatusResponse("createDB", constants.RESP_SUCCESS, "Record Added Successfully",data);
        //                log.info("[createDBEndpoint][createDB][add] >> Record Added Successfully  :"); 
        ////                return callback(null,jsonObj);//callback returning the response JSON back to client 
        //            } });
                          
        //                $fh.db({
        //                    "act": "list",
        //                    "type": "CalorieKing",
        ////                    "fields":"Food[1].Veggies"
        //                    "eq" : {
        //                    "id":"Veggies"
        //                }
        //                    
        //                }, function(err, pqr) {
        //                    if (err) {
        //                        var fail = respUtils.constructStatusResponse("createDB", constants.RESP_SERVER_ERROR, err,{});
        //                        log.error("[createDBEndpoint]["+"createDB"+"][READ DATA] >> " + err);
        //                        return callback(fail,null);
        //                                    
        //                    }
        //                    else{
        //                        var sss = JSON.stringify(pqr,null,4);
        //                        fs.writeFile('./cloud/CalorieKingDB/abc.json', sss, function(err) {
        //                            if (err) {
        //                                console.log('Error writing JSON file: ', err);
        //                                throw err;
        //                            }
        //                            console.log('\nNew JSON file saved!');
        ////                            self.updateDB(function() {
        //                                return callback('test');
        ////                            });
        //                        });
        //                    }
        //                });
                            
                            
                            
       

    });
}

