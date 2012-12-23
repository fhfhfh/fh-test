/**
 * @fileOverview The runner for our client-side Mocha unit tests.
 */


require.config({
  baseUrl: '/app/',
  paths: {
    'mocha': 'lib/mocha',
    'chai': 'lib/chai',
    'feedhenry': 'lib/feedhenry',
    'zepto': 'lib/zepto',
    'underscore': 'lib/underscore',
    'backbone': 'lib/backbone',
    'fastclick': 'lib/fastclick',
    'iscroll': 'lib/iscroll'
  },
  shim: {
    'mocha': {
      exports: 'mocha'
    },
    'feedhenry': {
      exports: '$fh'
    },
    'zepto': {
      exports: 'Zepto'
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'zepto'],
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
    'tests/test.NotificationManager'
  ], function() {
    if (window.mochaPhantomJS) {
      mochaPhantomJS.run();
    } else {
      mocha.run();
    }
  });
});
