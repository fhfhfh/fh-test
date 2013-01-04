/**
 * @fileOverview The main entrypoint to the application, where we define the
 * function which gets called by requirejs at first.
 */


require.config({
  paths: {
    'feedhenry': 'lib/feedhenry',
    'jquery': 'lib/jquery',
    'underscore': 'lib/underscore',
    'backbone': 'lib/backbone',
    'fastclick': 'lib/fastclick',
    'iscroll': 'lib/iscroll'
  },
  shim: {
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


require([
    'feedhenry',
    'jquery',
    'backbone',
    'fastclick',
    'NotificationManager',
    'routers/AppRouter'
], function($fh, $, Backbone, FastClick, NotificationManager, AppRouter) {

  // To enable development (and future deployment) on desktop browsers, we make
  // sure that we use the appropriate DOM ready event.
  var onReady = (window.cordova) ? function(readyFun) {
    document.addEventListener('deviceready', readyFun, false);
  } : $;

  onReady(function() {
    // ALthough using new for side effects is generally bad, in the case of
    // setting up app-wide 'listener' type modules, it's sometimes useful.
    /*jshint nonew:false */

    new NotificationManager();
    new FastClick(document.body);

    // TODO: This should be configure for appropriate app domain once created.
    // Also note window.location.origin is WebKit only.
    $fh.init({
      host: window.location.origin || 'http://127.0.0.1:8888',
      appid: 'doesntmatterhere',
      appkey: 'doesnmatterhere',
      mode: 'dev'
    }, function(res) {
      var appRouter = new AppRouter();

      // We disable pushState support within PhoneGap instances of the app, as
      // this has been known to cause problems.
      Backbone.history.start({
        pushState: !window.cordova
      });
    }, function(msg, err) {
      console.log(msg, err);
      Backbone.trigger('notify', 'FeedHenry init failed!');
    });
  });
});
