requirejs.config({
  paths: {
    'zepto'      : '/js/lib/zepto',
    'underscore' : '/js/lib/underscore',
    'backbone'   : '/js/lib/backbone',
    'feedhenry'  : '/js/lib/feedhenry',
    'iScroll'    : '/js/lib/iScroll',
    'Router'     : '/app/Router',
    'text'       : 'lib/text',
    'templates'  : '/templates',
    'collections': '/app/collections',
    'controllers': '/app/controllers',
    'models'     : '/app/models',
    'views'      : '/app/views',
    'map'        : '/app/cloudFunctionMap'
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
    
    // Backbone.history = new Backbone.History();
    Backbone.history.start({
      pushState: false,
      root: document.location.pathname
    });
  });
});
