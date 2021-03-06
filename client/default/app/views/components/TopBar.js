/**
 * Backbone view for the TopBar area of the screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/TopBar.html',
    'views/Profile',
    'models/Acts',
    'controllers/avatars'
    ], function($, _, Backbone, tpl, ProfView, Acts,controller) {

        return Backbone.View.extend({
            avatarSrc : "",
            peachyPoints : "",
            events: {
                'click #profile-button': 'showProfile',
                'click #save'          : 'saveProf',
                'click #cancel'        : 'cancel',
                'click #logout'          : 'logout',
                'click #points-button' : 'setPeachyPoints',
                'click #avatar'        : 'showPopup'
            },

            initialize: function() {
                _.bindAll(this);
                // this.setPeachyPoints();
                this.render();
                profView = new ProfView();
            },

            render: function() {
                this.$el = $('#topBar');
                this.$el.html(tpl);
                this.setAvatar();
                return this.$el;
            },

            hide: function(){
                this.$el.hide();
            },

            show: function(){
                this.$el.show();
            },

            showProfile: function(){
                Backbone.history.navigate('profile', true);
                $('#top-bar').addClass('profileBar');
            },

            saveProf: function(){
                profView.saveDetails();
            },

            cancel: function(){
                window.history.back();
                var points = this.setPeachyPoints();
                this.setAvatar();
                this.$('#points-button em').html(points);

                $('#top-bar').removeClass('profileBar');
            },

            logout: function(){
               $('#topBarPopup').hide();
                avatar_id = "";
                imgUrl= "";
                var setAvatars=this.setAvatar();
                // TODO : clear session ID from local storage, and possibly all user data
                var params = "";
                Acts.call('logoutAction', params,
                    function(res){
                    }, function(err, msg){
                        console.log(err);
                    }
                );
                Backbone.history.navigate('login', true);
            },

            setPeachyPoints : function(){
                Acts.call('peachyPointsAction', {},
                    function(res){
                        var points = res.payload.points[0].peachyPoints;
                        this.$('#points-button em').html(points);
                        peachyPoints = points;
                        return(points);
                    },
                    function(err, msg){
                        console.log(err);
                    }
                    );
            },

            setAvatar : function(){
                var self = this;
                var avatar = controller.getUserAvatar();
                if(avatar){
                    var image = avatar.image64;
                    self.$('#avatar').attr("src", "data:image/png;base64,"+image);
                    $('#account-information').find('img').attr("src", "data:image/png;base64,"+image);
                }
            },

            showPopup: function(){
                $('#topBarPopup').toggle();
            }
        });
    });
