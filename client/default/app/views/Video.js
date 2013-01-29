/**
 * Backbone view for the Video Playback screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pages/VideoPlayback.html',

], function($, _, Backbone, tpl) {

    return Backbone.View.extend({
      tagName: 'div',
      id: 'VideoPlayback',
      template: _.template(tpl),

        events: {
            'click #doneBtn'   : 'close'
        },

        initialize: function() {
            _.bindAll(this);
            this.video = JSON.parse(localStorage.getItem('tempVid'));
            localStorage.removeItem('tempVid');
            this.render();
        },

        render: function() {
            var self = this;
            this.$el.html(self.template({
                url: self.video.url,
                title: self.video.title,
                description: self.video.description
            }));
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


        close: function(){
            this.remove();
            // Backbone.history.back();
            Backbone.history.navigate('home', true);
        }
    });
});
