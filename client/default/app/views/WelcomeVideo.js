/**
 * Backbone view for the Welcome Video screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pages/WelcomeVideo.html',
    'models/User',
    'views/components/TopBar',

    ], function($, _, Backbone, tpl, User,TopBar) {

        return Backbone.View.extend({
            tagName: 'div',
            id: 'welcome-video',

            events: {
                'click #close'       : 'close',
                'click #welcomeVideo': 'toggleState'
            },

            initialize: function() {
                _.bindAll(this);
                this.$topBar = this.$('#top-bar');
                this.render();
                
            },

            render: function() {
                this.$el.html(tpl);
                return this;
            },

            loadVideo: function(url){
                url = 'http://www.youtube.com/embed/xqkBW1NCRLQ';
                // dummy vid
                // http://mirrorblender.top-ix.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov
                var vid = this.$('#video');
                // http://www.youtube.com/embed/qF1kNnHOHrE
                var html = '<iframe width="600" height="345"'+
                'src="'+url+'?modestbranding=1;tite=;controls=0"'+
                'frameborder="0" allowfullscreen></iframe>';

                vid.html(html);
            },

            toggleState: function(){
                var self = this;
                var video = this.$('video')[0];
                var videoWrapper = this.$('#video');

                var status= $('<p class="status"></p>');
                videoWrapper.append(status);
                status = this.$('.status')[0];

                if(video.paused){
                    video.play();
                    // TODO: fadeout the status message
                    self.$('.status').remove();
                }
                else{
                    status.innerHTML = 'PAUSED';
                    video.pause();
                }
            },

            close: function(){
                var user = new User();
                var topbar = new TopBar();
                var flag=0;
                user.loadUser(function(res, data){
                    if(res){
                        if(data){
					
                            details = data.userDetails || {};
                            this.$topBar = this.$('#top-bar');
                            flag = 1;
                        }
                    }else{
                        flag = 0;
                        alert('TODO: error handling');
                    }
                });
                
                if (flag == 1)
                {
                    this.remove();
                    Backbone.history.navigate('home', {
                        trigger: true,
                        replace: true
                    });
                }
                else
                {
                    this.remove();
                    Backbone.history.navigate('home', {
                        trigger: true,
                        replace: true
                    });
                    Backbone.history.navigate('profile', true);
                    $('#top-bar-buttons').html('<li><button id="cancel">Cancel</button></li>' +
                        '<li><button id="save">Save</button></li>');
          
                }
           
            }
        });
    });
