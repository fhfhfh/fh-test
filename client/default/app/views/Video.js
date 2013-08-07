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
            'click #logo': 'logout',
            'touchmove #wrapper': 'test',
            'webkitTransitionEnd #wrapper': 'webKitEnd',
            'click #prev': 'prevItem',
            'click #next': 'nextItem',
            'click #page0': 'go2Page0',
            'click #page1': 'go2Page1',
            'click #page2': 'go2Page2'
        },



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
            this.video = videos[0];
            localStorage.removeItem('tempVid');

            this.$el.html(self.template({
                url: self.video.url + "?modestbranding=1;rel=0;controls=1", // disable related videos
                title: self.video.title,
                time: self.video.duration,
                description: self.video.description
            }));

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

        webKitEnd: function(e) {
            e.stopPropagation();
            var self = this;
            this.removeIframe(self.videos);
            var id = $('.swipeview-active').attr('data-page-index');
            var item = self.videos[id];
            item.current = true;

            // console.log('Animation end, ' + item.desc + ' : ' + item.current);

            if (item.current === true) {
                self.videoPlayer(item);
            }
            return false;
        },

        test: function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
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
            var self = this;
            this.refreshScroll();
            this.checkFav();

            setTimeout(function() {
                self.createSwipeView();
            }, 100);

            return this;
        },

        createSwipeView: function() {
            var self = this;
            this.playList = new SwipeView(self.$('#wrapper')[0], { //Instanciate Swipeview.js
                numberOfPages: self.videos.length,
                hastyPageFlip: true
            });

            // $(document).ready(function() { // Load library data and handle current video
            console.log("Document loaded");
            console.log(self.playList.masterPages);
            self.loadData();

            setTimeout(function() {
                var id = self.$('.swipeview-active').attr('data-page-index');
                console.log(id);
                self.item = self.videos[id];
                console.log(self.item);
                var item = self.item;
                console.log(item);
                // item.current = true;

                if (item.current === true) {
                    self.videoPlayer(item);
                }
            }, 10);
            // });

            this.playList.onFlip(function() { // handler to load next view data
                console.log('flip');
                var el,
                    upcoming,
                    i;

                for (i = 0; i < self.videos.length; i++) {
                    upcoming = self.playList.masterPages[i].dataset.upcomingPageIndex;
                    console.log(upcoming);
                    if (upcoming != self.playList.masterPages[i].dataset.pageIndex) {
                        // loadThumb();
                        var img = $('img');
                        el = self.playList.masterPages[i].img;
                        console.log(el);
                        el.className = 'loading';
                        el.id = upcoming;
                        el.src = self.videos[upcoming].imgUrl;
                        el.width = 550; //videos[upcoming].width;
                        el.height = 300; //videos[upcoming].height;

                    }
                }

                this.find('#nav > li.selected').removeClass('.selecteds');
                self.dots[self.playList.pageIndex + 1].hasClass('.selected');
                // $(document).querySelector('#nav .selected').className = '';
                // self.dots[self.playList.pageIndex + 1].className = 'selected';
            });

            this.playList.onMoveOut(function() { // remove .swipeview-active class from div 
                console.log('erty');
                self.playList.masterPages[self.playList.currentMasterPage].className =
                    self.playList.masterPages[self.playList.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
                // $('.swipeview-active').removeClass('swipeview-active');
            });

            this.playList.onMoveIn(function() { // add .swipeview-active class to viewport div
                var className = self.playList.masterPages[this.currentMasterPage].className;
                /(^|\s)swipeview-active(\s|$)/.test(className) || (self.playList.masterPages[self.playList.currentMasterPage].className = !className ? 'swipeview-active' : className + 'swipeview-active');
                // $(self.playList.masterPages[this.currentMasterPage]).addClass('swipeview-active');
            });
            return this.playList;
        },

        prevItem: function(e) {
            this.playList.prev();
        },

        nextItem: function(e) {
            this.playList.next();
        },

        go2Page0: function(e) {
            this.playList.goToPage(0);
        },

        go2Page1: function(e) {
            this.playList.goToPage(1);
        },

        go2Page2: function(e) {
            this.playList.goToPage(2);
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
                    el.width = 550; //videos[i].width;
                    el.height = 300; //videos[i].height;
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
            var id = this.$('.swipeview-active').attr('data-page-index');
            this.$('.swipeview-active > img').remove();
            el = document.createElement('iframe');
            el.className = '';
            el.src = item.url;
            el.width = 550; //item.width;
            el.height = 300; //item.height;
            el.onload = function(e) {
                className = '';
                self.updateDescription();
            };
            this.$('.swipeview-active[data-page-index="' + id + '"]').html(el);
        },

        removeIframe: function() { // Remove iframe and replace with thumb.
            var videos = this.videos;
            var iframe = $('div:not(.swipeview-active) > div > iframe');
            var parent = $(iframe).parent();
            var index = parent.attr('data-page-index');
            iframe.remove();
            console.log('removed iframe' + " id : " + index);

            el = document.createElement('img');
            console.log(videos, index);
            el.src = videos[index].imgUrl;
            el.width = 550; //videos[index].width;
            el.height = 300; //videos[index].height;
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