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
  'views/components/TopBar'
], function($, _, Backbone, LoginView, MainView, ProfileView, WidgetView, HealthHubView, ConnectView, CalendarView, LibraryView, NavView, TopBar) {

  return Backbone.Router.extend({
    topBar : new TopBar(),
    leftNav: new NavView(),

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
      '*path'        : 'default'
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
      this.topBar.hide();
      this.leftNav.hide();
      console.log('##');

    },

    ensureMain: function() {

      // TODO: Consider how settings will be navigable.
      if (!this.mainView) {
        this.mainView = new MainView();
      }
    },

    home: function() {
      // this.ensureMain();
      this.mainView = new MainView();
      this.topBar.show();
      this.leftNav.show();
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
    }
  });
});
