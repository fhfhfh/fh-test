/**
 * @fileOverview: Backbone view which encapsulates the main content area of the
 * application.
 */

define(['jquery',
    'underscore',
    'backbone',
    'views/ContainerView',
    'views/main/Home',
    'views/components/TopBar',
    'text!templates/pages/Main.html',
    'iscroll',
    'views/Widgets',
    'views/HealthHub',
    'views/Connect',
    'views/cal',
    'views/Library',
    'models/Acts',
    
    ], function($, _, Backbone, ContainerView, HomeView, TopBar, template, iScroll, 
        WidgetsView, HealthHubView, ConnectView, CalendarView, LibraryView,Acts) {


        //interface----------------------------------
        return ContainerView.extend({
            tagName	: 'section',
            id		: 'main',
            events : {
                'click #home' : 'home',
                'click #widgets' : 'widgets',
                'click #healthHub' : 'healthHub',
                'click #connect' : 'connect',
                'click #calendar': 'calendar',
                'click #library' : 'library'
            },
    
            setPeachyPoints 		: _setPeachyPoints,
      

            subViews: {
                home: new HomeView(),
                widgets : new WidgetsView(),
                healthHub : new HealthHubView(),
                connect : new ConnectView(),
                calendar : new CalendarView(),
                library : new LibraryView()
            },

            initialize: function(options) {
                var self = this;
                this.setPeachyPoints();
                this.$el.html(template);
                this.$content = this.$('#main-content');
                this.$nav = this.$('#main-nav');
                this.$topBar = this.$('#top-bar');

                this.iscroll = new iScroll(this.$('#main-iscroll')[0], {
                    hscroll: false,
                    fixedScrollbar: true,
                    bounce: false,
                    vScrollbar: false
                });

                Backbone.View.prototype.refreshScroll = function() {
                    setTimeout(function() {
                        if (self.iscroll) {
                            self.iscroll.refresh.call(self.iscroll);
                        }
                    }, 100);
                };

                _.bindAll(this);

                var topbar = new TopBar();

                this.setActiveView(((options && options.activeView) || 'home'));
            },

            render: function() {
                this.refreshScroll();
                this.delegateEvents();
                this.$topBar = this.$('#top-bar');
                if (this.activeView) {
                    this.activeView.delegateEvents();
                }
                return this;
            },

            home: function() {
                this.setActiveView('home');
                this.$nav.find('li').removeClass('selected');
                this.$('#home').addClass('selected');
            },

            widgets: function() {
                this.setActiveView('widgets');
                this.$nav.find('li').removeClass('selected');
                this.$('#widgets').addClass('selected');
            },

            healthHub: function() {
                this.setActiveView('healthHub');
                this.$nav.find('li').removeClass('selected');
                this.$('#healthHub').addClass('selected');
            },

            calendar: function() {
                this.setActiveView('calendar');
                console.log('here');
            },

            connect: function() {
                Backbone.trigger('notify', 'Under Construction');
            // this.setActiveView('connect');
            },

            library: function() {
                Backbone.trigger('notify', 'Under Construction');
            // this.setActiveView('library');
            }

    


        });
        
        function _setPeachyPoints(){
            Acts.call('peachyPointsAction', {}, 
                function(res){
                    var points = res.payload.points[0].peachyPoints;
                    this.$('#points-button em').html(points);
                }, 
                function(err, msg){
                    console.log(err);
                }
                );
        }
        
        
        
        
    });
