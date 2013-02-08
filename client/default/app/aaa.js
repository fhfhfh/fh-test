doAuthorise = function(uname, callback){
if (NetworkRail.app.debugMode){
alert("DEBUG Authorisation: Username : " + uname);
}

$fh.act({
"act": "authoriseUser",
"req": {"uname" : uname}
}
,function(res){
//NOTE: Implementing work around . Cloud request sent on different port when invalid user. Raised with FH
if (res.error){
if (NetworkRail.app.debugMode){
console.log(uname + ": Authorisation failed. " + res.error);
}
return callback(res.error, null);
}

return callback(null, res.success.ROLE);
},
function(err){
if (NetworkRail.app.debugMode){
console.log(uname + ": Authorisation failed. " + err);
}
return callback(err, null);
});
}