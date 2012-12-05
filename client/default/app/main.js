requirejs.config({
  paths: {
    'zepto': 'lib/zepto',
    'underscore': 'lib/underscore',
    'backbone': 'lib/backbone'
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
    'Router'
], function($, Backbone, Router) {

  $(function() {
    window.app = new Router();
    Backbone.history.start({
      pushState: false,
      root: document.location.pathname
    });
  });

  // $('body').html(loginTemplate);
});
