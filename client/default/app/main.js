/**
 * @fileOverview The main entrypoint to the application, where we define the
 * function which gets called by requirejs at first.
 */

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

  onReady(function() {

    // TODO: This should be configure for appropriate app domain once created.
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
