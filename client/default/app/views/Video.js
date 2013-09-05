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
            'click li': 'goTo'
        },

        // global varibales
        el: '',
        PlayList: '',
        i: '',
        currentID: '',
        video: '',
        videosArr: '',
        dots: document.querySelectorAll('#nav li'),
        active: $('.swipeview-active'),

        initialize: function() {
            var self = this;
            _.bindAll(this);

            // Store videos playlist
            this.videosArr = JSON.parse(localStorage.getItem('tempVid'));
            self.video = this.videosArr[0];
            localStorage.removeItem('tempVid');

            // get active video array index
            for (i = 0; i < self.videosArr.length; i++) {
                this.video = self.videosArr[i];
                if (this.video.current === true) {
                    currentID = i;
                }
            }

            // store fav video selection
            var favVid = self.videosArr;
            console.log("****", favVid);

            // // render favourites vid player
            if (favVid && favVid.current === true) {
                console.log("**** createSingleView");
                self.video = favVid;
            }

            // create view template
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
            // ------------------------------------

            // detect ori change 
            // this.oriHandler();
            // this.iscroll2 = new iScroll(this.$('#wrapper')[0], {
            //     hscroll: true,
            //     vscroll: false,
            //     fixedScrollbar: true,
            //     bounce: false,
            //     hScrollbar: false
            // });

        },

        // load iframe video player
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

        // swipeview defaults
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

            return this;
        },

        // create fav Video view
        createSingleView: function(video) {
            var self = this;
            $('#nav').hide(); // hide dot nav
            $('#videoDescription').css("height", "550px"); // adjust desc height

            // wait for eleemnts to load
            setTimeout(function() {
                if (self.video.current === true) {
                    var el = document.createElement('iframe');
                    el.src = self.video.url;
                    el.id = 'favVid';
                    el.width = 550;
                    el.height = 300;
                    el.onload = function() {
                        self.updateDescription(video);
                    };
                    self.$('#wrapper').html(el);
                }
            }, 10);
        },

        // load video playlist view
        createSwipeView: function() {
            var self = this;
            var videoIndex;

            // create dynamic dot nav
            this.navigation(self.videosArr);

            // check size of video arr & reset
            if (self.videosArr.length < 3) {
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

            // set to playlist or fav video
            var libVideo = this.item || self.video;

            // pass variable to correct view fn
            if (libVideo === self.video) {
                console.log("\blibVideo favVid loaded ", libVideo);
                self.createSingleView(libVideo);
                this.current = false;
            } else if (libVideo.current === true) {
                self.videoPlayer(libVideo);
                libVideo.current = false;
                console.log("\nlibVideo Playlist loaded ", libVideo);
            }

            // Load img into next page.
            this.PlayList.onFlip(function(dots) {
                var el, i;
                var vids = self.videosArr;
                var currentPage = 0;
                var nextItem = 0;
                var nextPage = self.$('div > #swipeview-masterpage-' + currentPage);

                console.log('onFlip', vids);

                currentPage = +currentPage + +$('.swipeview-active').attr('data-upcoming-page-index');
                nextItem = +currentPage + +1;

                // reset nextItem index 
                if (nextItem >= vids.length) {
                    nextItem = 0;
                    console.log("Reset Videos array index value", nextItem);
                }

                // load image to placeholder
                el = $('#' + nextItem);
                el.attr('src', vids[nextItem].imgUrl);
                el.className = 'loading';

                console.log('\nNext video title:', vids[nextItem].title);

                // show current video dot
                self.$('.activeDot').removeClass('activeDot');
                self.$('#page' + nextItem).addClass('activeDot');
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

        // detect orientation change
        oriHandler: function(e) {
            window.addEventListener('orientationchange', function() {
                switch (window.orientation) {
                    case 0:
                        console.log("Portrait - 0");
                        $('#nav').css({
                            'top': '40%',
                            'left': '32%'
                        });
                        break;
                    case -0:
                        console.log("Portrait - -0");
                        $('#nav').css({
                            'top': '40%',
                            'left': '32%'
                        });
                        break;
                    case 90:
                        console.log("Landscape - 90");
                        $('#nav').css({
                            'top': '53%',
                            'left': '41%'
                        });
                        break;
                    case -90:
                        console.log("Landscape - -90");
                        $('#nav').css({
                            'top': '53%',
                            'left': '41%'
                        });
                        break;
                }
            });
        },

        // load iframe & object url if current equals. 
        videoPlayer: function(item) {
            var self = this;
            var id = self.$('.swipeview-active').attr('data-page-index');
            $('#nav').show(); // show dot nav

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

            // center nav based on arrLength
            this.positionNav(self.videosArr);

            // set active dot to first videos
            nav.find('#page0').addClass('activeDot');
        },

        // center dot nav
        positionNav: function(videosArr) {
            var arrLength = this.videosArr.length;

            if (arrLength <= 2) {
                console.log("*** dotNav Size", arrLength);
                $('#VideoPlayback').find('#nav-wrapper').css('left', '43%');
            } else if (arrLength > 2 || arrLength <= 4) {
                console.log("*** dotNav Size", arrLength);
                $('#VideoPlayback').find('#nav-wrapper').css('left', '40%');
            } else if (arrLength > 4 || arrLength <= 6) {
                console.log("*** dotNav Size", arrLength);
                $('#VideoPlayback').find('#nav-wrapper').css('left', '37%');
            } else if (arrLength > 6 || arrLength <= 8) {
                console.log("*** dotNav Size", arrLength);
                $('#VideoPlayback').find('#nav-wrapper').css('left', '37%');
            }
        },

        // update description with event
        updateDescription: function(video) {
            var videos = this.videosArr;
            var id;
            var thisItem;

            id = self.$('.swipeview-active').attr('data-page-index');
            console.log("update-description-id", id);

            // pass array of videos / fav Video obj's
            thisItem = videos[id] || video;

            // Add Video details
            $('#titleName').html(thisItem.title);
            $('#duration').html(thisItem.duration);
            $('#vidDesc').html(thisItem.description);
        },

        prevItem: function(e) {
            this.PlayList.prev();
        },

        goTo: function(e) {
            var target = e.currentTarget;
            var id = target.id;
            id = id.substring(4, 5);
            console.log("\n** Page Index", id);

            this.PlayList.goToPage(id);
        },

        nextItem: function(e) {
            this.PlayList.next();
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