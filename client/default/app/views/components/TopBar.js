/**
 * Backbone view for the TopBar area of the screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/TopBar.html',
    'views/Profile',
      'models/Acts'
], function($, _, Backbone, tpl, ProfView, Acts) {

    return Backbone.View.extend({

        events: {
            'click #profile-button' : 'showProfile',
            'click #save'   : 'saveProf',
            'click #cancel' : 'cancel',
            'click #logo'   : 'logout',
         'click #points-button'	        : 'setPeachyPoints'
        },

        initialize: function() {
            _.bindAll(this);
              this.setPeachyPoints();
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
        },
        
          setPeachyPoints : function(){
         Acts.call('peachyPointsAction', {}, 
                function(res){
                    var points = res.payload.points[0].peachyPoints;
                    this.$('#points-button em').html(points);
                }, 
                function(err, msg){
                    console.log(err);
                }
                );
        }
        
    });
});
