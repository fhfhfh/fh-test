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
        dots: $('#nav li'),
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

            var item;
            var self = this;
            var id = self.$('.swipeview-active').attr('data-page-index');

            // Find iFrame and replace with img
            this.removeIframe(self.videos);

            // find current object
            item = self.videos[id];

            // chq boolean value of item and convert
            if (item.current === false) {
                item.current = true;
                // console.log("Webkit item.current = " + item.current);
            }

            // if current item boolean true create iframe
            if (item.current === true) {
                self.videoPlayer(item);
                item.current = false;
                console.log("webkit after Player item.current = " + item.current);
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
            }, 1000);

            return this;
        },

        createSwipeView: function(videos) {
            var self = this;
            var videoIndex;

            this.navigation(this.videos);

            if (this.videos.length < 3) {
                console.log('VIDEO', this.videos[2]);
                this.videos[2] = this.videos[0];
            }

            this.playList = new SwipeView(self.$('#wrapper')[0], { //Instanciate Swipeview.js
                numberOfPages: this.videos.length,
                hastyPageFlip: true
            });

            console.log("Document loaded", this.videos);

            // Capture video array index
            for (var i = 0; i < self.videos.length; i++) {
                var thisItem = self.videos[i];
                if (thisItem.current === true) {
                    videoIndex = i;
                    console.log("videoIndex: " + videoIndex);
                }
            }

            this.item = this.videos[videoIndex];
            var item = this.item;
            console.log("item contents : ", item);

            if (item.current === true) {
                this.videoPlayer(item);
                item.current = false;
                // console.log("After Player item.current = " + item.current);
            }

            // Load img into next page.
            this.playList.onFlip(function() {

                var el, i;
                var vids = self.videos;
                var currentPage = 0;
                var nextItem = 0;
                var nextPage = $('div > #swipeview-masterpage-' + currentPage + '');
                console.log('onFlip', vids);

                currentPage = +currentPage + +$('.swipeview-active').attr('data-upcoming-page-index');

                nextItem = +currentPage + +1;

                if (nextItem >= vids.length) {
                    nextItem = 0;
                    console.log("Reset Videos array index value", nextItem);
                }

                console.log("currentPage", currentPage, "nextPageElement", nextPage, "nextItem", nextItem);

                el = $('img').find('#' + nextItem);
                console.log($(el)[0]);
                console.log('nextItem title', vids[nextItem].title);
                $(el).attr('src', vids[nextItem].imgUrl);
                // el.src = vids[nextItem].imgUrl;
                el.className = 'loading';
                // el.width = 550;
                // el.height = 300;
                // $(nextPage).append(el);


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

        // Load initial data
        loadData: function(videos) {
            var self = this;
            videos = self.videos;
            console.log("videos", videos);
            for (i = 0; i < 3; i++) {
                var item = self.$('div[data-page-index="' + i + '"]');
                var itemIndex = i == 0 ? videos.length - 1 : i - 1;
                if (!item.hasClass('swipeview-active')) {
                    el = document.createElement('img');
                    el.className = 'loading';
                    el.id = itemIndex;
                    el.src = videos[itemIndex].imgUrl;
                    el.width = 550; //videos[i].width;
                    el.height = 300; //videos[i].height;
                    el.onload = function() {
                        this.className = '';
                        self.updateDescription();
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
            // item = this.item;
            var id = $('.swipeview-active').attr('data-page-index');
            console.log(item.imgUrl);
            this.$('.swipeview-active > img').remove();
            el = document.createElement('iframe');
            el.className = '';
            el.src = item.url + "?modestbranding=1;rel=0;controls=1";
            // console.log(el.src);
            el.width = 550; //item.width;
            el.height = 300; //item.height;
            el.onload = function(e) {
                className = '';
                self.updateDescription();
            };
            this.$('.swipeview-active[data-page-index="' + id + '"]').html(el);
        },

        // Remove iframe and replace with thumb.
        removeIframe: function(videos) {
            console.log("videos", videos);
            var self = this;
            // videos = self.videos;
            var iframe = $('iframe');
            var parent = $(self.$(iframe).parent()[0]);
            console.log("parent", parent);
            var index = parent.attr('data-page-index');
            console.log("index", index);
            iframe.remove();

            el = document.createElement('img');
            el.id = index;
            // el.src = videos[index].imgUrl;
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

            // Add previous btn
            prev.attr('id', 'prev');
            prev.html('<b>-</b>');
            nav.append(prev);

            // create dots based on arrya length
            for (i = 0; i < self.videos.length; i++) {
                li = $('<li></li>').attr('id', 'page' + i);
                nav.append(li);
            }

            // Add previous btn
            next.attr('id', 'next');
            next.html('<b>+</b>');
            nav.append(next);

            console.log("nav elements ", nav);
        },

        // update description with event
        updateDescription: function() {
            var videos = this.videos;
            var id = self.$('.swipeview-active').attr('data-page-index');
            // console.log(id);
            var item = videos[id];

            // Add Video details
            $('#titleName').html(item.title);
            $('#duration').html(item.duration);
            $('#vidDesc').html(item.description);
        }
    });
});