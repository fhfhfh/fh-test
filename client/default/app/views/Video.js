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
        // video : {
        //     url: '',
        //     title: 'test',
        //     time: '11:11',
        //     description: 'asdfasdf'
        // },

        events: {
            'click #doneBtn'   : 'close',
            'click #title'     : 'refreshScroll',
            'swipeleft #videoContainer' : 'log'
        },

        log:function(){
            console.log('asdfgasdf');
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

            this.iscroll2 = new iScroll(this.$('#wrapper')[0], {
                hscroll: true,
                vscroll: false,
                fixedScrollbar: true,
                bounce: false,
                hScrollbar: true
            });            
            // ------------------------------------------
        },

        refreshScroll: function(){
            // console.log('asd');
            var self = this;
            setTimeout(function() {
                if (self.iscroll) {
                    self.iscroll.refresh.call(self.iscroll);
                }
                if(self.iscroll2){
                    self.iscroll2.refresh.call(self.iscroll2);   
                }
                // var width = this.$('#videoContainer').width() - this.$('#pageDiv').width();
                // console.log(width);
                // this.$('#pageDiv').scrollLeft(width/2);
                self.iscroll2.scrollToElement('#currentVideo', '1s');
                window.scroll = self.iscroll2;
            }, 10);
        },

        render: function() {
            this.refreshScroll();

            return this;
        },

        close: function(){
            this.remove();
            // Backbone.history.navigate('home', true);
            window.history.back();
        }
    });
});
