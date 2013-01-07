define([
  'jquery',
  'underscore',
  'backbone',
  '../views/Login',
  'views/Main',
  'views/Profile',
  'views/Widgets',
  'views/HealthHub',
  'views/Connect',
  'views/Calendar',
  'views/Library',
  'views/components/LeftNav',
  'views/components/TopBar',
    'views/PageNotFound'
], function($, _, Backbone, LoginView, MainView, ProfileView, WidgetView, HealthHubView, ConnectView, CalendarView, LibraryView, NavView, TopBar, PageNotFoundView) {

  return Backbone.Router.extend({
    topBar : new TopBar(),
    leftNav: new NavView(),

    $content: $('#content'),

    routes: {
      ''             : 'startup',
      'login'        : 'login',
      'home'         : 'home',
      'widgets'      : 'widgets',
      'healthHub'    : 'healthHub',
      'connect'      : 'connect',
      'calendar'     : 'calendar',
      'library'      : 'library',
//      'home/news'  : 'homeNews',
//      'home/alerts': 'homeAlerts',
//      'home/goals' : 'homeGoals',
      'profile'      : 'profile',
      '*invalidUrl': 'pageNotFound'
    },

    initialize: function(options) {
      _.bindAll(this);

      // TODO: Make this actually check for a valid session.
      this.on('all', function(event) {
        var route = event.replace('route:', '');

        if (this.routes.hasOwnProperty(route) && route !== 'login') {
          this.postLoginRoute = route;

          this.navigate('login', {
            trigger: true,
            replace: true
          });
        }
      });

      Backbone.history.start({

        // We disable pushState support within PhoneGap instances of the app, as
        // this has been known to cause problems.
        pushState: !window.cordova,

        // To facilitate running unit tests, we provide a hook to allow our test
        // runner to disable firing a route straight away.
        silent: !!(options && options.testMode)
      });
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
      this.topBar.hide();
      this.leftNav.hide();
    },

    ensureMain: function() {

      // TODO: Consider how settings will be navigable.
      if (!this.mainView) {
        this.mainView = new MainView();
      }
    },

    home: function() {
      this.navigate('login', {
        trigger: true,
        replace: true
      });
      // this.ensureMain();
//      this.mainView = new MainView();
//      this.topBar.show();
//      this.leftNav.show();
    },

    widgets:function(){
      this.widgetView = new WidgetView();
    },
    healthHub: function(){
      this.healthHubView = new HealthHubView();
    },
    connect: function(){
      this.connectView = new ConnectView();
    },
    calendar: function(){
      this.calendarView = new CalendarView();
    },
    library: function(){
      this.libraryView = new LibraryView();
    },


    // TODO: Re-evaluate this function.
    profile: function() {
      this.leftNav.hide();
      this.topBar.showProfile();
      new ProfileView();
    },

    // TODO: This should show a useful 404 message or else just call startup.
    default: function() {
      this.navigate('login', true);
    },

    pageNotFound: function(path) {
      this.$content.html((new PageNotFoundView()).render().el);
    }
  });
});
