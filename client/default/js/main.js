requirejs.config({
  paths: {
    'zepto'      : '/js/lib/zepto',
    'underscore' : '/js/lib/underscore',
    'backbone'   : '/js/lib/backbone',
    'Router'     : '/app/Router',
    'text'       : 'lib/text',
    'templates'  : '/templates',
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
    }
  }
});

require([
    'zepto',
    'backbone',
    'Router',
    'namespace'
], function($, Backbone, Router, ns) {

  $(function() {
    window.App = new Router();
    
    // Backbone.history = new Backbone.History();
    Backbone.history.start({
      pushState: false,
      root: document.location.pathname
    });
  });
});
