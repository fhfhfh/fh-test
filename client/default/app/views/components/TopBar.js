/**
 * Backbone view for the TopBar area of the screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/TopBar.html',
    'controllers/Profile'
], function($, _, Backbone, tpl, ProfCtrl) {

    return Backbone.View.extend({

        events: {
            'click #profile-button' : 'showProfile',
            'click #save'   : 'saveDetails',
            'click #cancel' : 'cancel'
        },

        initialize: function() {
            _.bindAll(this);
            this.render();
            profCtrl = new ProfCtrl();
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
            app.navigate('profile', true);

            $('#top-bar-buttons').html('<li><button id="cancel">Cancel</button></li>' +
                '<li><button id="save">Save</button></li>');
        },

        saveDetails: function(){
            profCtrl.saveProfile(this);
            console.log('Saving...');
        },

        cancel: function(){
            app.navigate('home', true);

            $('#top-bar-buttons').html(
                '<li><button id="points-button"><em>200</em> points</button></li>'+
                '<li><button><img src="img/Search.png" alt="Search"></button></li>'+
                '<li><button><img src="img/Help.png" alt="Help"></button></li>'+
                '<li><button id="profile-button"><img src="img/OptionsGear.png" alt="Options"></button></li>');
        }
    });
});