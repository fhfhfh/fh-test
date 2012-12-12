/**
 * @fileOverview The main entrypoint to the application, where we define our
 * requirejs config and the function which gets called by requirejs at first.
 */

requirejs.config({
  paths: {
    'feedhenry': 'lib/feedhenry',
    'zepto': 'lib/zepto',
    'underscore': 'lib/underscore',
    'backbone': 'lib/backbone',
    'fastclick': 'lib/fastclick',
    'iscroll': 'lib/iscroll'
  },
  shim: {
    'feedhenry': {
      deps: [],
      exports: '$fh'
    },
    'zepto': {
      deps: [],
      exports: 'Zepto'
    },
    'underscore': {
      deps: [],
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'zepto'],
      exports: 'Backbone'
    },
    'iscroll' : {
      deps: [],
      exports: 'iScroll'
    }
  }
});

require([
    'feedhenry',
    'zepto',
    'backbone',
    'fastclick',
    'Router'
], function($fh, $, Backbone, FastClick, Router) {

  // To enable development (and future deployment) on desktop browsers, we make
  // sure that we use the appropriate DOM ready event.
  var onReady = (window.cordova) ? function(readyFun) {
    document.addEventListener('deviceready', readyFun, false);
  } : $;

  // TODO: This should be configure for appropriate app domain once created.
  onReady(function() {
    $fh.init({
      host: 'http://127.0.0.1:8888',
      appid: 'doesntmatterhere',
      appkey: 'doesnmatterhere',
      mode: 'dev'
    }, function(res) {

      // Recommended use of FastClick is to wrap entire body in it.
      new FastClick(document.body);

      window.app = new Router();
      Backbone.history.start({

        // TODO: Re-evaluate whether this could be turned on for PhoneGap app.
        pushState: false
      });
    }, function(msg, err) {

      // TODO: Add nicer error popup dialog to application.
      console.log('msg: ', msg);
      console.log('err: ', err);
      alert('Error initialising the $fh API; see console for logs.');
    });
  });
});
