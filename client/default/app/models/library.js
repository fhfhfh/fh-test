/**
 * @fileOverview Stores the LIbrary model for the app
 */


define([
  'underscore',
  'backbone',
  'models/Store',
  'models/Acts'
], function(_, Backbone, Store, Act) {

  return new Backbone.Model.extend({

    storageKey: 'peachy_library',
    entries: {
        misc     : [],
        favorites  : [],
        
    },

    initialize: function() {
      _.bindAll(this);
    },

    isEmpty: function(){
        var e = this.entries;
        if(e.alerts.length + e.reminders.length + e.expirations.length < 1){
            return true;
        }
        else {
            return false;
        }
    },

    fetchAlerts: function(callback){
        var self = this;

        var alertsOld = this.entries.alerts;
        var remindersOld = this.entries.reminders;
        var expirationsOld = this.entries.expirations;


        // Empty current entries
        this.entries.alerts      = [];
        this.entries.reminders   = [];
        this.entries.expirations = [];
        

        Act.call('fetchAlertAction', {}
        , function(res) {
            var entries = res.payload.alerts;

            return callback(self.entries);
        }, function(err, msg) {
            Backbone.trigger('notify', 'Failed to fetch user alerts from cloud', 'Sync Failure');
            return callback(false);
        });
    },

    createFolder: function(name, item){
        var self = this;
        this.entries[name] = [];

        if(item){
            self.entries[name].push(item);
        }
    }

  });
});
