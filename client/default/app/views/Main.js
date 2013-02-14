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
    'views/main/Widgets',
    'views/main/HealthHub',
    'views/main/Connect',
    'views/main/Calendar',
    'views/main/Library',
    'models/Acts',
    'models/Store'

    ], function($, _, Backbone, ContainerView, HomeView, TopBar, template, iScroll,
        WidgetsView, HealthHubView, ConnectView, CalendarView, LibraryView,Acts,Store) {

        return ContainerView.extend({
            tagName	: 'section',
            id		: 'main',
            events : {
                'click #home' : 'home',
                'click #widgets' : 'widgets',
                'click #healthHub' : 'healthHub',
                'click #medicine' : 'medicine',
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
                this.$content = this.$('#child-content');
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
                this.checkUser();
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


            // Check if we need to show Profile page first
            checkUser: function(){
                Store.load('userProfile', function(res, data){
                    var data = JSON.parse(data);
                    var userDetails = data.userDetails;

                    if(userDetails.newDataValidation == '0'){
                        setTimeout(function(){
                            Backbone.history.navigate('profile', true, true);
                            $('#top-bar-buttons').html('<li><button id="cancel">Cancel</button></li>' +
                            '<li><button id="save">Save</button></li>');    
                        }, 100);
                        
                    }
                });
            },

            home: function() {
                this.setActiveView('home');
                this.$nav.find('li').removeClass('selected');
                this.$('#home').addClass('selected');
                Backbone.history.navigate('home', false);
            },

            widgets: function() {
                this.setActiveView('widgets');
                this.$nav.find('li').removeClass('selected');
                this.$('#widgets').addClass('selected');
                // Backbone.history.navigate('widgets', false);
            },

            healthHub: function() {
                this.setActiveView('healthHub');
                this.$nav.find('li').removeClass('selected');
                this.$('#healthHub').addClass('selected');
                // Backbone.history.navigate('healthHub', false);
            },

            medicine: function() {
                this.setActiveView('healthhub');
                this.$nav.find('li').removeClass('selected');
                this.$('#medicine').addClass('selected');
                // Backbone.history.navigate('medicine', false);
            },

            calendar: function() {
                this.setActiveView('calendar');
                this.$nav.find('li').removeClass('selected');
                this.$('#calendar').addClass('selected');
                // Backbone.history.navigate('calendar', false);
            },

            connect: function() {
                Backbone.trigger('notify', 'Under Construction');
            },

            library: function() {
                this.setActiveView('library');
                this.$nav.find('li').removeClass('selected');
                this.$('#library').addClass('selected');
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
                });
        }
    });
