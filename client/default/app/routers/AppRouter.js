/**
 * @fileOverview The main Backbone Router of the application.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'models/session',
    'views/Login',
    'views/Main',
    'views/PageNotFound',
    'views/Profile',
    'views/cal',
    'views/Video'
], function($, _, Backbone, session, LoginView, MainView, PageNotFoundView, ProfileView, CalendarView, VideoView) {

    return Backbone.Router.extend({

        // Everything within the app (bar the notifications) should be contained
        // within this div.
        $content: $('#content'),
        $topBar: $('#topBar'),

        routes: {
            ''         : 'startup',
            'login'    : 'login',
            'home(     /:page)': 'home',
            'widgets'  : 'widgets',
            'healthHub': 'healthHub',
            'connect'  : 'connect',
            'calendar' : 'calendar',
            'library'  : 'library',
            'video'    : 'video',
            'profile': 'profile',

            '*invalidUrl': 'pageNotFound'
        },

        initialize: function(options) {
            var self = this;
            _.bindAll(this);

            Backbone.history.start({
                // This breaks relative URLs when on, so leave off until evaluating options for the desktop version!
                pushState: false,

                // To facilitate running unit tests, we provide a hook to allow our test
                // runner to disable firing a route straight away. When testing the
                // router, pass it the option 'silent: true' when initialising.
                silent: (self.options && self.options.silent) || false
            });
        },

        startup: function() {
          if (session.isValid()) {
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
              loginView = new LoginView();

          session.logout();
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
            console.log(this.mainView.activeView);
            if (page) {
                if (this.mainView.subViews.home.setActiveView(page)) {
                    this.$content.html(this.mainView.render().el);
                }
            } else if(this.mainView.activeView.el.id != 'home') {
                this.mainView.setActiveView('home');
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
       healthHub: function(){
        this.ensureMain();
         this.mainView.setActiveView('healthHub');
       },
    //    connect: function(){
    //      this.connectView = new ConnectView();
    //    },
       calendar: function(){
         this.ensureMain();
         this.mainView.setActiveView('calendar');
       },
    //    library: function(){
    //      this.libraryView = new LibraryView();
    //    },


        // TODO: Re-evaluate this function.
       profile: function() {
        this.$content.html((new ProfileView()).render().el);
       },

       video: function() {
        this.$topBar.hide();
        this.$content.html((new VideoView()).render().el);
       }

    });
});
