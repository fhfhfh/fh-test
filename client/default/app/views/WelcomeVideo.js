/**
 * Backbone view for the Welcome Video screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pages/WelcomeVideo.html',
    'models/User',
    'views/components/TopBar',

    ], function($, _, Backbone, tpl, User,TopBar) {

        return Backbone.View.extend({
            tagName: 'div',
            id: 'welcome-video',

            events: {
                'click #close'       : 'close'
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

            loadVideo: function(url){
                var vid = this.$('#video');

                var html = '<iframe width="600" height="345"'+
                'src="'+url+'?modestbranding=1;tite=;controls=0"'+
                'frameborder="0" allowfullscreen></iframe>';

                vid.html(html);
            },

            close: function(){
                var user = new User();
                var topbar = new TopBar();
                var flag = this.newData;
                
                if (flag == '0')
                {
                    this.remove();
                    Backbone.history.navigate('home', {
                        trigger: true,
                        replace: true
                    });
                }
                else
                {
                    this.remove();
                    Backbone.history.navigate('home', {
                        trigger: true,
                        replace: true
                    });
                    Backbone.history.navigate('profile', true);
                    $('#top-bar-buttons').html('<li><button id="cancel">Cancel</button></li>' +
                        '<li><button id="save">Save</button></li>');
          
                }
           
            }
        });
    });
