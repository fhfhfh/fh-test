/**
 * @fileOverview The main entrypoint to the application, where we define the
 * function which gets called by requirejs at first.
 */


require.config({
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

require([
    'feedhenry',
    'zepto',
    'backbone',
    'fastclick',
    'NotificationManager',
    'Router'
], function($fh, $, Backbone, FastClick, NotificationManager, Router) {

  // To enable development (and future deployment) on desktop browsers, we make
  // sure that we use the appropriate DOM ready event.
  var onReady = (window.cordova) ? function(readyFun) {
    document.addEventListener('deviceready', readyFun, false);
  } : $;

  onReady(function() {

    new NotificationManager();

    // TODO: This should be configure for appropriate app domain once created.
    $fh.init({
      host: 'http://192.168.1.2:8888',
      appid: 'doesntmatterhere',
      appkey: 'doesnmatterhere',
      mode: 'dev'
    }, function(res) {

      Backbone.trigger('notify', 'FeedHenry init was a raging success!');

      // Recommended use of FastClick is to wrap entire body in it.
      new FastClick(document.body);

      window.app = new Router();
      Backbone.history.start({

        // Disabled for PhoneGap apps, as it can cause problems.
        // TODO: This should be enabled in the desktop version of the app.
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
