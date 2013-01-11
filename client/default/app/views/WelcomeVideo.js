/**
 * Backbone view for the Welcome Video screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pages/WelcomeVideo.html',

], function($, _, Backbone, tpl) {

    return Backbone.View.extend({
      tagName: 'div',
      id: 'welcome-video',

        events: {
            'click #close'       : 'close',
            'click #welcomeVideo': 'toggleState'
        },

        initialize: function() {
            _.bindAll(this);
            this.render();
        },

        render: function() {
            this.$el.html(tpl);
            return this;
        },

        loadVideo: function(url){
            // dummy vid
            // http://mirrorblender.top-ix.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov
            var vid = this.$('#video');
            var html =  '<video id="welcomeVideo"  poster="img/video/VideoPlaceholder.png" autoplay="autoplay">' +
                        '<source src=' + url +' type="video/mp4" />' +
                        'Your browser does not support the video tag.' +
                        '</video>';

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
            this.remove();
            Backbone.history.navigate('home', {
              trigger: true,
              replace: true
            });
        }
    });
});
