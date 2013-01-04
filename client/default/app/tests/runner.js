/**
 * @fileOverview The runner for our client-side Mocha unit tests.
 */


require.config({
  baseUrl: '/app/',
  paths: {
    'mocha': 'tests/lib/mocha',
    'chai': 'tests/lib/chai',
    'sinon': 'tests/lib/sinon',
    'sinon-chai': 'tests/lib/sinon-chai',
    'feedhenry': 'lib/feedhenry',
    'jquery': 'lib/jquery',
    'underscore': 'lib/underscore',
    'backbone': 'lib/backbone',
    'fastclick': 'lib/fastclick',
    'iscroll': 'lib/iscroll'
  },
  shim: {
    'mocha': {
      exports: 'mocha'
    },
    'sinon': {
      exports: 'sinon'
    },
    'feedhenry': {
      exports: '$fh'
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'iscroll' : {
      exports: 'iScroll'
    }
  }
});


require(['mocha'], function(mocha) {
  mocha.setup('bdd');

  // Don't forget to add reference to new tests here as they're added...
  require([
    'tests/specs/test.NotificationManager'
  ], function() {

    // If we're running the tests through the console interface provided by
    // mocha-phantomjs, we make use of the runner provided by it instead of the
    // vanilla mocha.run.
    if (window.mochaPhantomJS) {
      window.mochaPhantomJS.run();
    } else {
      mocha.run();
    }
  });
});
