/**
 * Backbone view for the TopBar area of the screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/TopBar.html',
    'views/Profile'
], function($, _, Backbone, tpl, ProfView) {

    return Backbone.View.extend({

        events: {
            'click #profile-button' : 'showProfile',
            'click #save'   : 'saveProf',
            'click #cancel' : 'cancel',
            'click #logo'   : 'logout'
        },

        initialize: function() {
            _.bindAll(this);
            this.render();
            profView = new ProfView();
        },

        render: function() {
            this.$el = $('#topBar');
            this.$el.html(tpl);
            return this.$el;
        },

        hide: function(){
            this.$el.hide();
        },

        show: function(){
            this.$el.show();
        },

        showProfile: function(){
            Backbone.history.navigate('profile', true);

            $('#top-bar-buttons').html('<li><button id="cancel">Cancel</button></li>' +
                '<li><button id="save">Save</button></li>');
        },

        saveProf: function(){
            profView.saveDetails();
        },

        cancel: function(){
            Backbone.history.navigate('home', true);

            $('#top-bar-buttons').html(
                '<li><button id="points-button"><em>200</em> points</button></li>'+
                '<li><button><img src="img/Search.png" alt="Search"></button></li>'+
                '<li><button><img src="img/Help.png" alt="Help"></button></li>'+
                '<li><button id="profile-button"><img src="img/OptionsGear.png" alt="Options"></button></li>');
        },

        logout: function(){
            // TODO : clear session ID from local storage, and possibly all user data
            Backbone.history.navigate('login', true);
        }
    });
});
