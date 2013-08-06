/**
 * Backbone view for the Video Playback screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'iscroll',
    'swipeview',
    'text!templates/pages/VideoPlayback.html',
    'views/components/AddFavorite'
], function($, _, Backbone, iScroll, SwipeView, tpl, FavBox) {

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
            'click #doneBtn': 'close',
            'click #saveBtn': 'addToFavorites',
            'click #removeBtn': 'removeFromFavs',
            'click #logo': 'logout'
        },

        // videos: [{
        //     desc: "Previous",
        //     width: 550,
        //     height: 300,
        //     current: false,
        //     thumb: "http://img.youtube.com/vi/A7GGHYk0AE4/0.jpg",
        //     url: "http://www.youtube.com/embed/A7GGHYk0AE4?modestbranding=1;rel=0;controls=1?modestbranding=1;tite=;controls=1",
        //     details: "This is the detail the previous video."
        // }, {
        //     desc: "Current",
        //     width: 550,
        //     height: 300,
        //     current: false,
        //     thumb: "http://img.youtube.com/vi/A7GGHYk0AE4/1.jpg",
        //     url: "http://www.youtube.com/embed/A7GGHYk0AE4?modestbranding=1;rel=0;controls=1?modestbranding=1;tite=;controls=1",
        //     details: "This is the detail the current video."
        // }, {
        //     desc: "Next",
        //     width: 550,
        //     height: 300,
        //     current: false,
        //     thumb: "http://img.youtube.com/vi/A7GGHYk0AE4/0.jpg",
        //     url: "http://www.youtube.com/embed/A7GGHYk0AE4?modestbranding=1;rel=0;controls=1?modestbranding=1;tite=;controls=1",
        //     details: "This is the detail of the next video."
        // }],

        // global varibales
        el: '',
        playList: '',
        i: '',
        dots: document.querySelectorAll('#nav li'),
        active: $('.swipeview-active'),
        // id: $('.swipeview-active').attr('data-page-index'),

        initialize: function() {
            console.log('init');
            var self = this;
            _.bindAll(this);

            this.videos = JSON.parse(localStorage.getItem('tempVid'));
            var videos = this.videos;
            this.video = this.videos[0];
            localStorage.removeItem('tempVid');

            this.$el.html(self.template({
                url: self.video.url + "?modestbranding=1;rel=0;controls=1", // disable related videos
                title: self.video.title,
                time: self.video.duration,
                description: self.video.description
            }));

            playList = new SwipeView(self.$('#wrapper')[0], { //Instanciate Swipeview.js
                numberOfPages: self.videos.length,
                hastyPageFlip: true
            });

            this.$(document).ready(function() { // Load library data and handle current video
                console.log("Document loaded");
                self.loadData();

                setTimeout(function() {
                    var id = this.$('.swipeview-active').attr('data-page-index');
                    self.item = self.videos[id];
                    var item = self.item;
                    console.log(id, item);
                    // item.current = true;

                    if (item.current === true) {
                        self.videoPlayer(item);
                    }
                }, 10);
            });
            /*   <<<<<<<<<<<<   EVENT LISTENERS   >>>>>>>>>>>>   */

            // Standard event listener for SwipeView.js lib

            document.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, false);

            // Animation end load iframe.

            document.addEventListener('webkitTransitionEnd', function(e) {
                removeIframe(videos);
                var id = $('.swipeview-active').attr('data-page-index');
                var item = videos[id];
                item.current = true;

                // console.log('Animation end, ' + item.desc + ' : ' + item.current);

                if (item.current === true) {
                    videoPlayer(item);
                }
            }, false);

            playList.onFlip(function() { // handler to load next view data
                var el,
                    upcoming,
                    i;

                for (i = 0; i < videos.length; i++) {
                    upcoming = playList.masterPages[i].dataset.upcomingPageIndex;

                    if (upcoming != playList.masterPages[i].dataset.pageIndex) {
                        loadThumb();
                        el = playList.masterPages[i].querySelector('img');
                        el.className = 'loading';
                        el.id = upcoming;
                        el.src = videos[upcoming].imgUrl;
                        el.width = videos[upcoming].width;
                        el.height = videos[upcoming].height;

                    }
                }

                document.querySelector('#nav .selected').className = '';
                dots[playList.pageIndex + 1].className = 'selected';
            });

            playList.onMoveOut(function() { // remove .swipeview-active class from div 
                playList.masterPages[playList.currentMasterPage].className =
                    playList.masterPages[playList.currentMasterPage].className
                    .replace(/(^|\s)swipeview-active(\s|$)/, '');

            });

            playList.onMoveIn(function() { // add .swipeview-active class to viewport div
                var className = playList.masterPages[playList.currentMasterPage].className;
                /(^|\s)swipeview-active(\s|$)/.test(className) || (playList.masterPages[playList.currentMasterPage]
                    .className = !className ? 'swipeview-active' : className + 'swipeview-active');
            });


            // // iScroll ---------------------------
            // this.iscroll = new iScroll(this.$('#video-iscroll')[0], {
            //     hscroll: false,
            //     fixedScrollbar: true,
            //     bounce: false,
            //     vScrollbar: false
            // });

            // this.iscroll2 = new iScroll(this.$('#wrapper')[0], {
            //     hscroll: true,
            //     vscroll: false,
            //     fixedScrollbar: true,
            //     bounce: false,
            //     hScrollbar: false
            // });
            // ------------------------------------------
        },

        refreshScroll: function() {
            // console.log('asd');
            var self = this;
            setTimeout(function() {
                if (self.iscroll) {
                    self.iscroll.refresh.call(self.iscroll);
                }
            }, 10);
        },

        render: function() {
            this.refreshScroll();
            this.checkFav();
            return this;
        },

        logout: function() {
            Backbone.history.navigate('login', true);
        },

        close: function() {
            this.remove();
            // Backbone.history.navigate('home', true);
            window.history.back();
        },

        addToFavorites: function() {
            var self = this;
            var view = new FavBox(self.video);
            $('body').append(view.render());
            view.show();
        },

        removeFromFavs: function() {
            var self = this;
            var view = new FavBox(self.video);
            view.removeItem();
            this.checkFav();
        },

        checkFav: function() {
            var self = this;
            var view = new FavBox(self.video);
            // check if video is in favorites already
            var bool = view.inFavs();
            if (bool) {
                this.$('#removeBtn').show();
            } else {
                this.$('#removeBtn').hide();
            }
        },

        loadData: function() { // Load initial data
            var videos = this.videos;
            for (i = 0; i < videos.length; i++) {
                var item = this.$('div[data-page-index="' + i + '"]');
                if (!item.hasClass('swipeview-active')) {
                    console.log(i, item);
                    el = document.createElement('img');
                    el.className = 'loading';
                    el.id = i;
                    el.src = videos[i].imgUrl;
                    el.width = videos[i].width;
                    el.height = videos[i].height;
                    el.onload = function() {
                        this.className = '';
                    };
                    item.html(el);
                } else {
                    console.log('ACTIVE', item);
                }
            }
        },

        videoPlayer: function() { // load iframe & object url if current equals. 
            var self = this;
            var item = this.item;
            var id = $('.swipeview-active').attr('data-page-index');
            $('.swipeview-active > img').remove();
            el = document.createElement('iframe');
            el.className = '';
            el.src = item.url;
            el.width = item.width;
            el.height = item.height;
            el.onload = function(e) {
                className = '';
                self.updateDescription();
            };
            $('.swipeview-active[data-page-index="' + id + '"]').html(el);
        },

        removeIframe: function() { // Remove iframe and replace with thumb.
            var videos = this.videos;
            var iframe = $('div:not(.swipeview-active) > div > iframe');
            var parent = $(iframe).parent();
            var index = parent.attr('data-page-index');
            iframe.remove();
            console.log('removed iframe' + " id : " + index);

            el = document.createElement('img');
            el.src = videos[index].thumb;
            el.width = videos[index].width;
            el.height = videos[index].height;
            parent.html(el);
        },

        updateDescription: function() {
            var videos = this.videos;
            var id = $('.swipeview-active').attr('data-page-index');
            var item = videos[id];
            $('#description').html(item.details);
        }
    });
});