define(['zepto',
        'underscore',
        'backbone',
        'text!templates/login.tpl'
], function($, _, Backbone, loginTemplate) {
  return Backbone.Router.extend({
    routes: {
      '': 'startup',
      'login': 'login'
    },

    initialize: function() {
      _.bindAll(this);
    },

    startup: function() {

      // TODO: No backend implementation, so just skipping to login every time.
      this.navigate('login', {
        trigger: true,
        replace: true
      });
    },

    login: function() {
      // TODO: Move this to it's own view and implement loading within it.
      $('body').html(loginTemplate);
    }
  });
});
