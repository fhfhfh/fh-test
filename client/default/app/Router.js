define(['zepto',
        'underscore',
        'backbone',
        'views/Login',
        'views/Main',
        'views/Profile'
], function($, _, Backbone, LoginView, MainView, ProfileView) {

  return Backbone.Router.extend({

    routes: {
      '': 'startup',
      'login': 'login',
      'home': 'home',
//      'home/news': 'homeNews',
//      'home/alerts': 'homeAlerts',
//      'home/goals': 'homeGoals',
      'profile': 'profile',
      '*path': 'default'
    },

    initialize: function() {
      _.bindAll(this);
    },

    startup: function() {

      // TODO: Implement auto-login system for user cred storage locally.
      this.navigate('login', {
        trigger: true,
        replace: true
      });
    },

    login: function() {

      // TODO: When implemented, clear localStorage appropriately.
      var loginView = new LoginView();
      $('#content').html(loginView.render().el);
    },

    ensureMain: function() {

      // TODO: Consider how settings will be navigable.
      if (!this.mainView) {
        this.mainView = new MainView();
      }
    },

    home: function() {
      this.ensureMain();
    },


    // TODO: Re-evaluate this function.
    profile: function() {
      new ProfileView();
    },

    // TODO: This should show a useful 404 message or else just call startup.
    default: function() {
      this.navigate('login', true);
    }
  });
});
