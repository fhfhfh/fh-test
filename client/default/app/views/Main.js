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
    'views/main/Medicine',
    'views/main/Connect',
    'views/main/Calendar',
    'views/main/Library',
    'models/Acts',
    'models/Store'

    ], function($, _, Backbone, ContainerView, HomeView, TopBar, template, iScroll,
        WidgetsView, HealthHubView, MedicineView, ConnectView, CalendarView, LibraryView,Acts,Store) {

        return ContainerView.extend({
            tagName	: 'section',
            id		: 'main',
            events : {
                'click #main-nav li' : 'changeTab',
                'click #home' : 'home',
                'click #widgets' : 'widgets',
                'click #healthHub' : 'healthHub',
                'click #medicine' : 'medicine',
                'click #connect' : 'connect',
                'click #calendar': 'calendar',
                'click #library' : 'library'
            },

            setPeachyPoints	: _setPeachyPoints,


            subViews: {
                home: new HomeView(),
                widgets : new WidgetsView(),
                healthHub : new HealthHubView(),
                medicine : new MedicineView(),
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

                // this.iscroll = new iScroll(this.$('#main-iscroll')[0], {
                //     hscroll: false,
                //     fixedScrollbar: true,
                //     bounce: false,
                //     vScrollbar: false
                // });

                Backbone.View.prototype.refreshScroll = function() {
                    var self = this;
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

                this.home();
                
                return this;
            },


            // Check if we need to show Profile page first
            checkUser: function(){
                Store.load('userProfile', function(res, data){
                    data = JSON.parse(data);
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

            changeTab: function() {
                var home =this.$nav.find('li#home').find('img')[0];
                $(home).attr('src', 'img/nav/HomeWhite.png');
                var widget =this.$nav.find('li#widgets').find('img')[0];
                $(widget).attr('src', 'img/nav/WidgetsWhite.png');
                var hub =this.$nav.find('li#healthHub').find('img')[0];
                $(hub).attr('src', 'img/nav/HubWhite.png');
                var med =this.$nav.find('li#medicine').find('img')[0];
                $(med).attr('src', 'img/nav/CabinetWhite.png');
                var cal =this.$nav.find('li#calendar').find('img')[0];
                $(cal).attr('src', 'img/nav/CalendarWhite.png');
                var library =this.$nav.find('li#library').find('img')[0];
                $(library).attr('src', 'img/nav/LibraryWhite.png');
            },

            home: function() {
                var self = this;
                this.setActiveView('home');
                this.$nav.find('li').removeClass('selected');
                this.$('#home').addClass('selected');
                var li = this.$nav.find('li.selected').find('img')[0];
                $(li).attr('src', 'img/nav/HomeDark.png');
                Backbone.history.navigate('home', false);

            },

            widgets: function() {
                this.setActiveView('widgets');
                this.$nav.find('li').removeClass('selected');
                this.$('#widgets').addClass('selected');
                var li = this.$nav.find('li.selected').find('img')[0];
                $(li).attr('src', 'img/nav/WidgetsDark.png');
            // Backbone.history.navigate('widgets', false);
            },

            healthHub: function() {
                this.setActiveView('healthHub');
                this.$nav.find('li').removeClass('selected');
                this.$('#healthHub').addClass('selected');
                var li = this.$nav.find('li.selected').find('img')[0];
                $(li).attr('src', 'img/nav/HubDark.png');
            // Backbone.history.navigate('healthHub', false);
            },

            medicine: function() {
                this.setActiveView('medicine');
                this.$nav.find('li').removeClass('selected');
                this.$('#medicine').addClass('selected');
                var li = this.$nav.find('li.selected').find('img')[0];
                $(li).attr('src', 'img/nav/CabinetDark.png');
                //Backbone.trigger('notify', 'Under Construction');
            },

            calendar: function() {
                this.setActiveView('calendar');
                this.$nav.find('li').removeClass('selected');
                this.$('#calendar').addClass('selected');
                var li = this.$nav.find('li.selected').find('img')[0];
                $(li).attr('src', 'img/nav/CalendarDark.png');
            // Backbone.history.navigate('calendar', false);
            },

            connect: function() {
                // var li = this.$nav.find('li#connect').find('img')[0];
                // $(li).attr('src', 'img/nav/ConnectDark.png');
                Backbone.trigger('notify', 'Under Construction');
            },

            library: function() {
                this.setActiveView('library');
                this.$nav.find('li').removeClass('selected');
                this.$('#library').addClass('selected');
                var li = this.$nav.find('li.selected').find('img')[0];
                $(li).attr('src', 'img/nav/LibraryDark.png');
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