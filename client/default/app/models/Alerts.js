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

    fetchAlerts: function(callback){
        var self = this;

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
            console.log(self.entries);
            var strEntries = JSON.stringify(self.entries);
            Store.save(self.storageKey, self.entries, function(){});

            return callback(self.entries);
        }, function(err, msg) {
            Backbone.trigger('notify', 'Failed to fetch user alerts from cloud');
            return callback(false);
        });
    },

    // sync: function(method, model, options) {
    //   var self = this;

    //   switch (method) {
    //     case 'read':
    //       getAlerts();
    //       break;
    //     case 'create':
    //       saveAlerts();
    //       break;
    //     case 'update':
    //       saveAlerts();
    //       break;
    //   }

    //   function getAlerts() {
    //     Act.call('fetchAlertAction', {} 
    //     , function(res) {
    //       options.success(model, res, options);
    //       self.trigger('sync', model, res, options);
    //     }, function(err, msg) {
    //       var theError = {
    //         err: err,
    //         msg: msg
    //       };
    //       options.error(model, theError, options);
    //       self.trigger('error', model, theError, options)
    //     });
    //   }

    //   function saveSession() {
    //     var self = this;

    //     Store.save(self.storageKey, self.get('id'), function(){});
    //   }
    // },

    // parse: function(res) {
    //   return {
    //     id: res.response.head.sessionId,
    //     timestamp: (new Date()).valueOf()
    //   };
    // }
  });

  return alerts;
});
