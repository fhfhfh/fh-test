var runner = require('./lib/runner'),
    async = require('async'),

tests = [];
tests.push('testLoginAction');

  var testFuncs = [];

  for (var i = 0; i < tests.length; i++) {
    (function(i) {
      testFuncs.push(function(callback) {
        var test = require('./' + tests[i]);
        runner(test, function() {
          callback(null, i);
        });
      });
    })(i);
  }

  /** 
   * We now have an array of functions (tests) to run, we call these asynchronously.
   */
  async.parallel(testFuncs, function(err, results) {});