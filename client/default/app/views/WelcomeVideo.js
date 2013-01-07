/**
 * Backbone view for the Welcome Video screen
 */

define([
    'zepto',
    'underscore',
    'backbone',
    'text!templates/pages/WelcomeVideo.html',

], function($, _, Backbone, tpl) {

    return Backbone.View.extend({

        events: {
            'click #close' : 'close',
            'click video'  : 'toggleState'
        },

        initialize: function() {
            _.bindAll(this);
            this.render();
        },

        render: function() {
            this.$el = $('#content');
            this.$el.html(tpl);
            return this.$el;
        },

        loadVideo: function(url){
            // dummy vid
            // http://mirrorblender.top-ix.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov
            var vid = this.$('#video');
            var html =  '<video  poster="img/video/bigbuckbunny.jpg" autoplay="autoplay">' +
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

            console.log(status);
            if(video.paused){
                status.innerHTML ='PLAY';
                video.play();
            }
            else{
                status.innerHTML = 'PAUSE';
                video.pause();
            }

            setTimeout(function(){
                // TODO: fadeout the status message
                self.$('.status').remove();
            }, 1000);
        },

        close: function(){
            console.log('close');
        }
    });
});
