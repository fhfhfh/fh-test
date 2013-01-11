requirejs.config({
  paths: {
    'zepto'      : 'lib/zepto',
    'underscore' : 'lib/underscore',
    'backbone'   : 'lib/backbone',
    'feedhenry'  : 'lib/feedhenry',
    'iScroll'    : 'lib/iScroll',
    'Router'     : '../Router',
    'text'       : 'lib/text',
    'templates'  : '../templates',
    'collections': '../collections',
    'controllers': '../controllers',
    'models'     : '../models',
    'views'      : '../views',
    'map'        : '../cloudFunctionMap'
  },
  shim: {
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
    'feedhenry': {
      deps: [],
      exports: '$fh'
    },
    'iScroll' : {
      deps: [],
      exports: 'iScroll'
    }
  }
});

require([
    'zepto',
    'backbone',
    'feedhenry',
    'Router',
    'namespace'
], function($, Backbone, $fh, Router, ns) {

  $(function() {
    window.App = new Router();
    
    Backbone.history.start({
      pushState: false,
      root: document.location.pathname
    });
  });
});
