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
        PlayList: '',
        i: '',
        currentID: '',
        video: '',
        videosArr: '',
        dots: $('#nav').find('li'),
        active: $('.swipeview-active'),
        multiVideo: true,
        // id: $('.swipeview-active').attr('data-page-index'),

        initialize: function() {
            var self = this;
            _.bindAll(this);

            // console.log(dots);

            // Store videos playlist
            this.videosArr = JSON.parse(localStorage.getItem('tempVid'));
            self.video = this.videosArr[0];
            localStorage.removeItem('tempVid');

            // get active video array index
            for (i = 0; i < self.videosArr.length; i++) {
                this.video = self.videosArr[i];
                if (this.video.current === true) {
                    self.currentID = i;
                }
            }

            // create view template
            this.$el.html(self.template({
                url: self.video.url + "?modestbranding=1;rel=0;controls=1", // disable related videos
                title: self.video.title,
                time: self.video.duration,
                description: self.video.description
            }));

            // // iScroll ---------------------------
            this.iscroll = new iScroll(this.$('#video-iscroll')[0], {
                hscroll: false,
                fixedScrollbar: true,
                bounce: false,
                vScrollbar: false
            });



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
            var item;
            var self = this;
            var id = self.$('.swipeview-active').attr('data-page-index');

            // Find iFrame and replace with img
            self.removeIframe();

            // find current object
            item = self.videosArr[id];

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
            return false;
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

            setTimeout(function() {
                self.createSwipeView();
            }, 100);

            $('#page0').addClass('selected');
            return this;
        },

        createSingleView: function() {
            var videos = self.videosArr;
        },

        createSwipeView: function() {
            var self = this;
            var videoIndex;

            this.navigation(self.videosArr);

            // check size of video arr & reset
            if (self.videosArr.length < 3) {
                // console.log("VIDEO", self.videosArr[2]);
                self.videosArr[2] = self.videosArr[0];
            }

            // Instantciate Swipeview.js
            this.PlayList = new SwipeView(self.$('#wrapper')[0], {
                numberOfPages: self.videosArr.length,
                hastyPageFlip: true
            });

            // Capture video array index
            for (var i = 0; i < self.videosArr.length; i++) {
                var thisItem = self.videosArr[i];
                if (thisItem.current === true) {
                    videoIndex = i;
                }
            }

            // video playlist
            this.item = self.videosArr[videoIndex];
            var libVideo = this.item;

            if (libVideo.current === true) {
                self.videoPlayer(libVideo);
                libVideo.current = false;
                console.log("libVideo Playlist loaded ", libVideo);
            }

            // // Load img into next page.
            this.PlayList.onFlip(function() {
                var el, i;
                var vids = self.videosArr;
                var currentPage = 0;
                var nextItem = 0;
                var nextPage = self.$('div > #swipeview-masterpage-' + currentPage);

                console.log('onFlip', vids);

                currentPage = +currentPage + +$('.swipeview-active').attr('data-upcoming-page-index');

                nextItem = +currentPage + +1;

                if (nextItem >= vids.length) {
                    nextItem = 0;
                    console.log("Reset Videos array index value", nextItem);
                }

                el = $('#' + nextItem);
                el.attr('src', vids[nextItem].imgUrl);
                el.className = 'loading';

                console.log('nextItem title', vids[nextItem].title);

                $('.selected').removeClass('selected');
                $('#page' + nextItem).addClass('selected');
                // dots[nextItem + 1].addClass('selected');
            });


            // // remove .swipeview-active class from div
            this.PlayList.onMoveOut(function() {
                self.PlayList.masterPages[self.PlayList.currentMasterPage].className =
                    self.PlayList.masterPages[self.PlayList.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
            });

            // // add .swipeview-active class to viewport div
            this.PlayList.onMoveIn(function() {
                var className = self.PlayList.masterPages[self.PlayList.currentMasterPage].className;
                /(^|\s)swipeview-active(\s|$)/.test(className) || (self.PlayList.masterPages[self.PlayList.currentMasterPage].className = !className ? 'swipeview-active' : className + 'swipeview-active');
            });

            return this.PlayList;
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

        // // Load initial data
        // loadData: function() {
        //     var self = this;
        //     videos = self.videosArr;
        //     console.log("videos", videos);
        //     for (i = 0; i < 3; i++) {
        //         var item = self.$('div[data-page-index="' + i + '"]');
        //         var itemIndex = i == 0 ? videos.length - 1 : i - 1;
        //         if (!item.hasClass('swipeview-active')) {
        //             el = document.createElement('img');
        //             el.className = 'loading';
        //             el.id = itemIndex;
        //             el.src = videos[itemIndex].imgUrl;
        //             el.width = 550; //videos[i].width;
        //             el.height = 300; //videos[i].height;
        //             el.onload = function() {
        //                 this.className = '';
        //                 self.updateDescription();
        //             };

        //             item.html(el);
        //         } else {
        //             console.log('ACTIVE', item);
        //         }
        //     }
        // },

        // load iframe & object url if current equals. 
        videoPlayer: function(item) {
            var self = this;
            var id = self.$('.swipeview-active').attr('data-page-index');

            // remove img
            self.$('.swipeview-active > img').remove();

            // create iframe 
            el = document.createElement('iframe');
            el.className = '';
            el.src = item.url + "?modestbranding=1;rel=0;controls=1";
            el.width = 550;
            el.height = 300;
            el.onload = function(e) {
                this.className = '';
                self.updateDescription();
            };
            self.$('.swipeview-active[data-page-index="' + id + '"]').html(el);
        },

        // Remove iframe and replace with thumb.
        removeIframe: function() {
            var self = this;
            var iframe = $('iframe');
            var parent = $(self.$(iframe).parent()[0]);
            var index = parent.attr('data-page-index');

            iframe.remove();

            index = +index + -1;

            // create empty img tag and replace iframe
            el = document.createElement('img');
            el.id = index;
            el.className = '';
            el.width = 550;
            el.height = 300;
            parent.html(el);
        },

        // create dynamic dot navigation
        navigation: function(videosArr) {
            var self = this;
            var i;
            var prev = $('<li></li>');
            var next = $('<li></li>');
            var li;
            var nav = $('#nav');

            // Add previous btn
            prev.attr('id', 'prev');
            prev.html('<b>-</b>');
            nav.append(prev);

            // create dots based on arrya length
            for (i = 0; i < self.videosArr.length; i++) {
                li = $('<li></li>').attr('id', 'page' + i);
                nav.append(li);
            }

            // Add previous btn
            next.attr('id', 'next');
            next.html('<b>+</b>');
            nav.append(next);
        },

        // update description with event
        updateDescription: function(id) {
            var videos = this.videosArr;
            var id;
            var thisItem;

            id = self.$('.swipeview-active').attr('data-page-index');
            console.log("update-description-id", id);

            thisItem = videos[id];

            // Add Video details
            $('#titleName').html(thisItem.title);
            $('#duration').html(thisItem.duration);
            $('#vidDesc').html(thisItem.description);

        },

        prevItem: function(e) {
            this.PlayList.prev();
        },

        nextItem: function(e) {
            this.PlayList.next();
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