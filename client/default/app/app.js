/**
 * @fileOverview The main entrypoint to the application, where we define the
 * function which gets called by RequireJS at first, as well as initial config
 * for RequireJS.
 */


require.config({
  paths: {
    'feedhenry': 'lib/feedhenry',
    'jquery': 'lib/jquery',
    'underscore': 'lib/underscore',
    'backbone': 'lib/backbone',
    'fastclick': 'lib/fastclick',
    'iscroll': 'lib/iscroll',
    'fullcalendar': 'fullcalendar/fullcalendar/fullcalendar',
    'hash' : 'lib/hash',
    'jflot' : 'lib/jquery.flot',
    'flottime':'lib/jquery.flot.time'
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
    },
    'fullcalendar': {
      deps: ['jquery'],
      exports: '$.fn.fullCalendar'
    },
    'jflot': {
      deps: ['jquery'],
      exports:'$.plot'
    },
    'flottime' :{
        deps: ['jflot']
//        exports:'$.plot'
    }
  }
});


require([
    'feedhenry',
    'jquery',
    'backbone',
    'fastclick',
    'NotificationManager',
    'routers/AppRouter',
    'fullcalendar',
    'jflot',
    'flottime'

], function($fh, $, Backbone, FastClick, NotificationManager, AppRouter) {

  // To enable development (and future deployment) on desktop browsers, we make
  // sure that we use the appropriate DOM ready event.
  var onReady = (window.cordova) ? function(readyFun) {
    document.addEventListener('deviceready', readyFun, false);
  } : $;

  onReady(function() {
    /*jshint nonew:false */

    // ALthough using new for side effects is generally bad, in the case of
    // setting up app-wide 'listener' type modules, it's sometimes useful.
    new NotificationManager();
    new FastClick(document.body);

    // window.location.origin is WebKit only, however for testing during
    // initial development, this is all that matters. Otherwise it will default
    // to localhost on fhc local's standard port. Also note that this config is
    // replaced by Grunt during the build process, so there should be no need to
    // ever change here.
    $fh.init({
      host: window.cordova ?
          'http://127.0.0.1:8888' :
          window.location.origin || 'http://127.0.0.1:8888',
      // appid: 'doesntmatterhere',
      // appkey: 'doesnmatterhere',
      appid: '2MZDpXsUThCoLHsCb4-UoNNH',
      appkey: '4c81bba36a10bcf9bd7a47a8cad91b94be3679a5',

      mode: 'dev'
    }, function() {
      new AppRouter();

      // $fh.fh_timeout = 120000;

    }, function() {
      Backbone.trigger('notify', 'FeedHenry init failed!');
    });
  });
});
