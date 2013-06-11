/**
 * Backbone view for the Video Playback screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'iscroll',
    'text!templates/pages/VideoPlayback.html',
    'views/components/AddFavorite'
], function($, _, Backbone, iScroll, tpl, FavBox) {

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
            'click #doneBtn'  : 'close',
            'click #title'    : 'refreshScroll',
            'click #saveBtn'  : 'addToFavorites',
            'click #removeBtn': 'removeFromFavs',
            'click #logo'     : 'logout',
            'click #title'    : 'nextVideo'
        },

        initialize: function() {
            var self = this;
            _.bindAll(this);

            this.prev = JSON.parse(localStorage.getItem('prevVid'));
            this.video = JSON.parse(localStorage.getItem('tempVid'));
            this.next = JSON.parse(localStorage.getItem('nextVid'));

            localStorage.removeItem('prevVid');
            localStorage.removeItem('tempVid');
            localStorage.removeItem('nextVid');


            this.$el.html(self.template({
                url: self.video.url + "?modestbranding=1;rel=0;controls=1", // disable related videos
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
                hScrollbar: false
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
            this.checkFav();
            return this;
        },

        logout: function(){    
            Backbone.history.navigate('login', true);
        },

        close: function(){
            this.remove();
            // Backbone.history.navigate('home', true);
            window.history.back();
        },

        addToFavorites: function(){
            var self=this;
            var view = new FavBox(self.video);
            $('body').append(view.render());
            view.show();
        },

        removeFromFavs: function(){
            var self=this;
            var view = new FavBox(self.video);
            view.removeItem();
            this.checkFav();
        },

        checkFav: function(){
            var self=this;
            var view = new FavBox(self.video);
            // check if video is in favorites already
            var bool = view.inFavs();
            if(bool){
                this.$('#removeBtn').show();
            }
            else{
                this.$('#removeBtn').hide();   
            }
        },

        nextVideo: function(){
            var self = this;

            // if(this.next){
            //     $('#pageDiv').animate({"right": "+=500px"}, 500).show();

            //     setTimeout(function(){
            //         self.$el.html(self.template({
            //             url: self.next.url + "?modestbranding=1;rel=0;controls=1", // disable related videos
            //             title: self.next.title,
            //             time: self.next.duration,
            //             description: self.next.description
            //         }));
            //     },500);    
            // }
            // this.refreshScroll();          
                        
        }

    });
});
