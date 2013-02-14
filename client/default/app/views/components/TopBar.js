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
                'click #profile-button' : 'showProfile',
                'click #save'   : 'saveProf',
                'click #cancel' : 'cancel',
                'click #logo'   : 'logout',
                'click #points-button'	        : 'setPeachyPoints'
            },

            initialize: function() {
                _.bindAll(this);
                // this.setPeachyPoints();
                this.setAvatar();
                this.render();
                profView = new ProfView();
            },

            render: function() {
                this.$el = $('#topBar');
                this.$el.html(tpl);
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

                $('#top-bar-buttons').html('<li><button id="cancel">Cancel</button></li>' +
                    '<li><button id="save">Save</button></li>');
            },

            saveProf: function(){
                profView.saveDetails();
            },

            cancel: function(){
                // Backbone.history.navigate('home', true);
                window.history.back();
                var points = this.setPeachyPoints();
                //var setAvatars=this.setAvatar();
                var image = avatarSrc;
                this.$('#avatar').attr("src", "data:image/png;base64,"+image);
                this.$('#account-information').find('img').attr("src", "data:image/png;base64,"+image);
                $('#top-bar-buttons').html(
                    '<li><button id="points-button"><em></em> points</button></li>'+
                    '<li><button><img src="img/Search.png" alt="Search"></button></li>'+
                    '<li><button><img src="img/Help.png" alt="Help"></button></li>'+
                    '<li><button id="profile-button"><img src="img/OptionsGear.png" alt="Options"></button></li>');
                this.$('#points-button em').html(points);
            //this.setAvatar();
                 
            },

            logout: function(){
               
                avatar_id = "";
                imgUrl= "";
                var setAvatars=this.setAvatar();
                // TODO : clear session ID from local storage, and possibly all user data
                var params = "";
                Acts.call('logoutAction', params, 
                    function(res){
                        console.log(res);
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
                controller.loadAvatars(function(url){
                    for (i=0; i<url.avatars.length; i++)
                    {
                       
                        if(url.avatars[i].avatarId == avatar_id)
                        { 
                            var image = url.avatars[i].image64;
                            avatarSrc = image;
                            
                            this.$('#avatar').attr("src", "data:image/png;base64,"+image);
                            this.$('#account-information').find('img').attr("src", "data:image/png;base64,"+image);
                        
                        }
                    }
                });
            }
        
        });
    });
