/**
 * @fileOverview The main Backbone Router of the application.
 */

define([
  'jquery',
  'underscore',
  'backbone',
  'models/Session',
  'views/Login',
  'views/Main',
  'views/PageNotFound',
  'views/Profile'
], function($, _, Backbone, Session, LoginView, MainView, PageNotFoundView, ProfileView) {

  return Backbone.Router.extend({

    // Everything within the app (bar the notifications) should be contained
    // within this div.
    $content: $('#content'),
    $topBar: $('#topBar'),

    routes: {
      '': 'startup',
      'login': 'login',
      'home(/:page)': 'home',

      'widgets': 'widgets',
      'healthHub': 'healthHub',
      'connect': 'connect',
      'calendar': 'calendar',
      'library': 'library',
      //      'home/news'  : 'homeNews',
      //      'home/alerts': 'homeAlerts',
      //      'home/goals' : 'homeGoals',
      'profile': 'profile',

      '*invalidUrl': 'pageNotFound'
    },

    initialize: function(options) {
      var self = this;

      _.bindAll(this);
      this.session = new Session();

      Backbone.history.start({

        // We disable pushState support within PhoneGap instances of the app, as
        // this has been known to cause problems.
        // TODO: Evaluate whether we shouldn't just turn this off everywhere.
        pushState: !window.cordova,

        // To facilitate running unit tests, we provide a hook to allow our test
        // runner to disable firing a route straight away. When testing the
        // router, pass it the option 'silent: true' when initialising.
        silent: (self.options && self.options.silent) || false
      });
    },

    startup: function() {
      if (this.session.isValid()) {
        this.navigate('home', {
          trigger: true,
          replace: true
        });
      } else {
        this.navigate('login', {
          trigger: true,
          replace: true
        });
      }
    },

    login: function() {
      var self = this,
          loginView = new LoginView({
            session: self.session
          });

      this.session.logout();
      this.$content.html(loginView.render().el);
      this.$topBar.hide();
    },

    ensureMain: function() {

      // TODO: Consider how settings will be navigable.
      if (!this.mainView) {
        this.mainView = new MainView();
      }
    },

    home: function(page) {
      this.ensureMain();
      this.$topBar.show();
      if (page) {
        if (this.mainView.subViews.home.setActiveView(page)) {
          this.$content.html(this.mainView.render().el);
        }
      } else {
        this.$content.html(this.mainView.render().el);
      }
    },

    pageNotFound: function(invalidUrl) {
      this.$content.html((new PageNotFoundView()).render().el);
    },

    // TODO: Cleanup below...
//    widgets:function(){
//      this.widgetView = new WidgetView();
//    },
//    healthHub: function(){
//      this.healthHubView = new HealthHubView();
//    },
//    connect: function(){
//      this.connectView = new ConnectView();
//    },
//    calendar: function(){
//      this.calendarView = new CalendarView();
//    },
//    library: function(){
//      this.libraryView = new LibraryView();
//    },


    // TODO: Re-evaluate this function.
   profile: function() {
    this.$content.html((new ProfileView()).render().el);
   }
  });
});
