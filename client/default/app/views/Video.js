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
            'touchmove #wrapper': 'swipeDefault',
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
        currentID: '',
        dots: $('#nav li'),
        active: $('.swipeview-active'),
        multiVideo: true,
        // id: $('.swipeview-active').attr('data-page-index'),

        initialize: function() {
            console.log('init');
            var self = this;
            _.bindAll(this);

            this.videos = JSON.parse(localStorage.getItem('tempVid'));
            var video; // = this.videos;

            console.log("this.video", self.videos);

            for (i = 0; i < self.videos.length; i++) {
                this.video = self.videos[i];
                console.log("this.video", self.video);
                if (this.video.current === true) {
                    currentID = i;
                }
            }

            console.log("currentID", currentID);

            localStorage.removeItem('tempVid');

            // var id = videos.id;


            this.$el.html(self.template({
                url: self.video.url + "?modestbranding=1;rel=0;controls=1", // disable related videos
                title: self.video.title,
                time: self.video.duration,
                description: self.video.description
            }));

            // this.video = this.video[currentID];
            // console.log("Current Video", this.video);

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
            return currentID;
        },

        webKitEnd: function(e) {
            e.stopPropagation();

            currentID = null;

            var item;
            var self = this;
            var id = self.$('.swipeview-active').attr('data-page-index');

            // Find iFrame and replace with img
            this.removeIframe(self.videos);
            // this.updateDescription();
            // find current object
            item = self.videos[id];

            // chq boolean value of item and convert
            if (item.current === false) {
                item.current = true;
            }

            // if current item boolean true create iframe
            if (item.current === true) {
                self.videoPlayer(item);
                item.current = false;
            }
        },

        swipeDefault: function(e) {
            e.preventDefault();
            e.stopPropagation();
            // return false;
        },

        refreshScroll: function() {
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

            this.createSwipeView();

            // if (favVideo.current === true) {
            //     self.createSwipeView();
            // }

            return this;
        },

        createSingleView: function() {
            var videos = this.videos;
            console.log("createSingleView", videos);

        },

        createSwipeView: function() {
            var self = this;
            var videoIndex;

            this.navigation(self.videos);
            this.loadData();

            if (self.videos.length < 3) {
                console.log('VIDEO', self.videos);
                self.videos[2] = self.videos[0];
            }

            this.playList = new SwipeView(self.$('#wrapper')[0], { //Instanciate Swipeview.js
                numberOfPages: self.videos.length,
                hastyPageFlip: true
            });

            console.log("Document loaded", this.videos, currentID);

            // Capture video array index
            for (var i = 0; i < self.videos.length; i++) {
                var thisItem = self.videos[i];
                if (thisItem.current === true) {
                    videoIndex = i;
                    // console.log("videoIndex: " + videoIndex);
                }
            }

            this.item = self.videos[videoIndex];
            var libVideo = this.items; //= this.item;
            var favVideo = self.videos;
            console.log("item contents : ", libVideo, favVideo);

            if (libVideo && libVideo.current === true) {
                self.videoPlayer(libVideo);
                libVideo.current = false;
                console.log("libVideo Playlist loaded ", libVideo);
                return false;
            } else if (favVideo && favVideo.current === true) {
                self.videoPlayer(favVideo);
                favVideo.current = false;
                console.log("favVideo Player loaded", favVideo);
            }

            // Load img into next page.
            this.playList.onFlip(function() {
                var el, i;
                var vids = self.videos;
                var currentPage = 0;
                var nextItem = 0;
                var nextPage = self.$('div > #swipeview-masterpage-' + currentPage + '');

                console.log('onFlip', vids);

                currentPage = +currentPage + +$('.swipeview-active').attr('data-upcoming-page-index');

                nextItem = +currentPage + +1;

                if (nextItem >= vids.length) {
                    nextItem = 0;
                    console.log("Reset Videos array index value", nextItem);
                }

                console.log("currentPage", currentPage, "nextPageElement", nextPage, "nextPage", nextItem);

                el = $('#' + nextItem);
                el.attr('src', vids[nextItem].imgUrl);
                el.className = 'loading';

                console.log('nextItem title', vids[nextItem].title);

                // $(document).querySelector('#nav .selected').className = '';
                // $(dots)[self.playList.pageIndex + 1].className = 'selected';
            });


            // remove .swipeview-active class from div
            this.playList.onMoveOut(function() {
                self.playList.masterPages[self.playList.currentMasterPage].className =
                    self.playList.masterPages[self.playList.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
            });

            // add .swipeview-active class to viewport div
            this.playList.onMoveIn(function() {
                var className = self.playList.masterPages[self.playList.currentMasterPage].className;
                /(^|\s)swipeview-active(\s|$)/.test(className) || (self.playList.masterPages[self.playList.currentMasterPage].className = !className ? 'swipeview-active' : className + 'swipeview-active');
            });
            return this.playList;
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

        // Load initial data
        loadData: function() {
            var self = this;
            console.log(self.videos);

            for (i = 0; i < 3; i++) {
                var item = self.$('div[data-page-index="' + i + '"]');
                // var item = $('swipeview-masterpage-' + i);
                console.log(item);
                var itemIndex = i == 0 ? self.videos.length - 1 : i - 1;

                if (!item.hasClass('swipeview-active')) {
                    el = document.createElement('img');
                    el.className = 'loading';
                    el.id = itemIndex;
                    el.src = this.videos[itemIndex].imgUrl;
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

        // load iframe & object url if current equals. 
        videoPlayer: function(item) {
            var self = this;
            var id = self.$('.swipeview-active').attr('data-page-index');

            // console.log(item.imgUrl);
            self.$('.swipeview-active > img').remove();

            el = document.createElement('iframe');
            el.className = '';
            el.src = item.url + "?modestbranding=1;rel=0;controls=1";
            el.width = 550;
            el.height = 300;
            el.onload = function(e) {
                className = '';
                self.updateDescription(id);
            };
            self.$('.swipeview-active[data-page-index="' + id + '"]').html(el);
        },

        // Remove iframe and replace with thumb.
        removeIframe: function(videos) {
            console.log("videos", videos);
            var self = this;

            var iframe = $('iframe');
            var parent = $(self.$(iframe).parent()[0]);
            // console.log("parent", parent);
            var index = parent.attr('data-page-index');
            // console.log("removeIframe index", index);
            iframe.remove();

            index = +index + -1;

            el = document.createElement('img');
            el.id = index;
            el.className = '';
            el.width = 550; //videos[index].width;
            el.height = 300; //videos[index].height;
            parent.html(el);
        },

        // create dynamic dot navigation
        navigation: function(videos) {
            var self = this;
            var i;
            var prev = $('<li></li>');
            var next = $('<li></li>');
            var li;
            var nav = $('#nav');

            console.log("nav", this.videos, "prev", prev, "next", next);

            // Add previous btn
            prev.attr('id', 'prev');
            prev.html('<b>-</b>');
            nav.append(prev);

            // create dots based on arrya length
            for (i = 0; i < this.videos.length; i++) {
                li = $('<li></li>').attr('id', 'page' + i);
                nav.append(li);
            }

            // Add previous btn
            next.attr('id', 'next');
            next.html('<b>+</b>');
            nav.append(next);

            // console.log("nav elements ", nav);
        },

        // update description with event
        updateDescription: function(id) {
            var videos = this.videos;
            var id;
            var thisItem;

            if (currentID === null) {
                id = self.$('.swipeview-active').attr('data-page-index');
            } else {
                id = currentID;
            }

            console.log("update-description-id", id);

            thisItem = videos[id];

            // Add Video details
            $('#titleName').html(thisItem.title);
            $('#duration').html(thisItem.duration);
            $('#vidDesc').html(thisItem.description);

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
        }
    });
});