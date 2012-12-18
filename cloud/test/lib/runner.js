process.env.testcase = true;
var main = require('../../main.js');
colors = require('colors');


// Overwrite the console.log function so the underlying function's DEBUG output doesn't get logged..
var oldLog = console.log;
console.log = function(msg){
  if (typeof msg == 'string'){
    var ss = msg.substring(0,5);
    if (ss != "DEBUG" && ss!="TRACE") oldLog(msg);
  }else{
    oldLog(msg);
  }
};

// The smarts behind an individual test.
function runTest(test, then){
  var name = test.name,
  description = test.desc,
  payload = test.payload,
  assertions = test.test;
  console.log('[' + name + ']: ' + description.yellow);

  (function(assertions, name, then) {
    main[name](payload, function(err, data){
      assertions(err, data, function(res){
        console.log('[' + name + ']: ' + 'Success! ✓'.green);
        if (then) {
          then(res);
        }
      });
    });
  })(assertions, name, then);
}

module.exports = runTest;