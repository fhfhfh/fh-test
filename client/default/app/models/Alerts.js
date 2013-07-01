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

        Act.call('fetchAlertAction', {},
        function(res) {
            var entries = res.payload.alerts;
            var item, today;

            //organise entries in model
            for(var i=0; i<entries.length; i++){
                // ----------- ALERTS -------------------------
                if(entries[i].noticeCatagory === "Alerts"){
                    item = entries[i];
                    today= new Date();
                    item.dueDate = new Date(item.noticeDueDate.split(' ')[0]);

                    if(self.checkToday(item.dueDate, today)){
                        item.dueDate = 'Today';
                        self.entries.alerts.push(item);
                    } else {
                        item.dueDate = item.noticeDueDate.split(' ')[0];
                        self.entries.alerts.push(item);
                    }
                }
                // ------------- REMINDERS ---------------------------
                else if(entries[i].noticeCatagory === "Reminders"){
                    item = entries[i];
                    today= new Date();
                    item.dueDate = new Date(item.noticeDueDate.split(' ')[0]);

                    if(self.checkToday(item.dueDate, today)){
                        item.dueDate = 'Today';
                        self.entries.reminders.push(item);
                    } else {
                        item.dueDate = item.noticeDueDate.split(' ')[0];
                        self.entries.reminders.push(item);
                    }
                }
                // ------------- EXPIRATIONS ----------------------------
                else if(entries[i].noticeCatagory === "Expirations"){
                    item = entries[i];
                    today= new Date();
                    item.dueDate = new Date(item.noticeDueDate.split(' ')[0]);

                    if(self.checkToday(item.dueDate, today)){
                        item.dueDate = 'Today';
                        self.entries.expirations.push(item);
                    } else {
                        item.dueDate = item.noticeDueDate.split(' ')[0];
                        self.entries.expirations.push(item);
                    }
                }
            }

            if(alertsOld == self.entries.alerts && remindersOld == self.entries.reminders && expirationsOld == self.entries.expirations){
                Backbone.trigger('notify', 'Alerts are up-to-date!', 'Sync Complete');
            }


            var strEntries = JSON.stringify(self.entries);
            Store.save(self.storageKey, strEntries, function(){});

            return callback(self.entries);
        }, function(err, msg) {
            Backbone.trigger('notify', 'Failed to fetch user alerts from cloud', 'Sync Failure');
            return callback(false);
        });
    },

    checkToday: function(d1, d2){
        return d1.getUTCFullYear() == d2.getUTCFullYear() &&
            d1.getUTCMonth() == d2.getUTCMonth() &&
            d1.getUTCDate() == d2.getUTCDate();
    }

  });

  return alerts;
});
