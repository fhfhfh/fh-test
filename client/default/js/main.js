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
