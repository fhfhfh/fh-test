/**
 * @fileOverview The apps Alerts model, which handles fetching and storing of alerts
 */


define([
  'underscore',
  'backbone',
  'models/Store',
  'models/Acts'
], function(_, Backbone, Store, Act) {

  var alerts = Backbone.Model.extend({

    storageKey: 'peachy_alerts',
    entries: {
        alerts     : [],
        reminders  : [],
        expirations: []
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

            //organise entries in model
            for(var i=0; i<entries.length; i++){
                if(entries[i].noticeCatagory === "Alerts"){
                    self.entries.alerts.push(entries[i]);
                }
                else if(entries[i].noticeCatagory === "Reminders"){
                    self.entries.reminders.push(entries[i]);   
                }
                else if(entries[i].noticeCatagory === "Expirations"){
                    self.entries.expirations.push(entries[i]);   
                }
            }

            if(alertsOld == self.entries.alerts && remindersOld == self.entries.reminders && expirationsOld == self.entries.expirations){
                Backbone.trigger('notify', 'Alerts are up-to-date!');
            }


            var strEntries = JSON.stringify(self.entries);
            Store.save(self.storageKey, strEntries, function(){});

            return callback(self.entries);
        }, function(err, msg) {
            Backbone.trigger('notify', 'Failed to fetch user alerts from cloud');
            return callback(false);
        });
    },

    // parse: function(res) {
    //   return {
    //     id: res.response.head.sessionId,
    //     timestamp: (new Date()).valueOf()
    //   };
    // }
  });

  return alerts;
});
