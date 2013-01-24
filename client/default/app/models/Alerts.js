/**
 * @fileOverview The apps Alerts model, which handles fetching and storing of alerts
 */


define([
  'underscore',
  'backbone',
  'models/Store',
  'models/Acts'
], function(_, Backbone, Store, Acts) {

  var Session = Backbone.Model.extend({

    storageKey: 'peachy_alerts',
    alerts : [],

    initialize: function() {
      _.bindAll(this);
    },

    sync: function(method, model, options) {
      var self = this;

      switch (method) {
        case 'read':
          getAlerts();
          break;
        case 'create':
          saveAlerts();
          break;
        case 'update':
          saveAlerts();
          break;
      }

      function getAlerts() {
        Acts('fetchAlertsAction', {}, 
        , function(res) {
          options.success(model, res, options);
          self.trigger('sync', model, res, options);
        }, function(err, msg) {
          var theError = {
            err: err,
            msg: msg
          };
          options.error(model, theError, options);
          self.trigger('error', model, theError, options)
        });
      }

      function saveSession() {
        var self = this;

        Store.save(self.storageKey, self.get('id'), function(){});
      }
    },

    parse: function(res) {
      return {
        id: res.response.head.sessionId,
        timestamp: (new Date()).valueOf()
      };
    }
  });

  return new Session();
});
