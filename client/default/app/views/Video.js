/**
 * Backbone view for the Video Playback screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'iscroll',
    'text!templates/pages/VideoPlayback.html',

], function($, _, Backbone, iScroll, tpl) {

    return Backbone.View.extend({
      tagName: 'section',
      id: 'VideoPlayback',
      template: _.template(tpl),

        events: {
            'click #doneBtn'   : 'close',
            'click #title'     : 'refreshScroll'
        },

        initialize: function() {
            var self = this;
            _.bindAll(this);

            this.video = JSON.parse(localStorage.getItem('tempVid'));
            localStorage.removeItem('tempVid');


            this.$el.html(self.template({
                url: self.video.url,
                title: self.video.title,
                time: self.video.duration,
                description: self.video.description
            }));


            // iScroll ---------------------------
            this.iscroll = new iScroll(this.$('#video-iscroll')[0], {
                hscroll: false,
                fixedScrollbar: true,
                bounce: false,
                vScrollbar: false
            });
            // ------------------------------------------
        },

        refreshScroll: function(){
            var self = this;
            setTimeout(function() {
                if (self.iscroll) {
                    self.iscroll.refresh.call(self.iscroll);
                }
            }, 10);
        },

        render: function() {
            this.refreshScroll();

            return this;
        },

        close: function(){
            this.remove();
            Backbone.history.navigate('home', true);
        }
    });
});
