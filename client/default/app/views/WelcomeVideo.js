/**
 * Backbone view for the Welcome Video screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pages/WelcomeVideo.html',
    'models/User',
    'views/components/TopBar'

], function($, _, Backbone, tpl, User, TopBar) {

    return Backbone.View.extend({
        tagName: 'div',
        id: 'welcome-video',

        events: {
            'click #close': 'close'
        },

        initialize: function() {
            _.bindAll(this);
            this.$topBar = this.$('#top-bar');
            this.render();
        },

        render: function() {
            this.$el.html(tpl);
            return this;
        },

        loadVideo: function(url) {
            console.log(url);
            var imgSrc = 'http://img.youtube.com/vi/xqkBW1NCRLQ/default.jpg';
            var vid = this.$('#video');

            var html = '<iframe id="introVid" width="690" height="390"' +
                'src="' + url + '?modestbranding=1;rel=0;controls=0;autoplay=1"' +
                'frameborder="0" allowfullscreen="false"></iframe>';

            vid.html(html);

            // change iframe contents width
            $('#introVid').load(function() {
                $('iframe').contents().find('head')
                .append($('<style type="text/css"> #player{ width: 101%;} </style>'));
                console.log("changed iframe contents width!!");
            });

            // var intro = document.getElementById('introVid');
            // intro.getElementsByClassName('.html5-video-player');
            // console.log(intro.getElementsByClassName('.html5-video-player'));
            // $('#introVid').ready(function() {
            //     console.log("\naccess iframe", $('#introVid').contents().find('body').find('.html5-video-player'));
            //     $('#introVid').contents().find('body').find('.html5-video-player').css("width", "101%");
            //     alert($('#introVid').contents().find('body').find('.html5-video-player'));
            // });

            console.log("\nVideo Url", url, "\nimg Src", imgSrc);
        },

        close: function() {
            this.remove();
            Backbone.history.navigate('home', {
                trigger: true,
                replace: true
            });
        }
    });
});