/**
 * @fileOverview The apps Session model, which handles logging in and out of the
 * application.
 */


define(['underscore', 'backbone', 'feedhenry', 'models/Acts'], function(_, Backbone, $fh, Acts) {

  return Backbone.Model.extend({

    localStorageKey: 'peachy_session',

    initialize: function() {
      _.bindAll(this);
    },

    defaults: {
      username: '',
      password: '',
      sessionId: '',
      timestamp: null
    },

    /**
     * Will attempt to set the session from localStorage, if a session exists
     * there and if that session is within an hour old.
     *
     * @return {boolean} Whether or not we successfully retrieved the session.
     */
    getFromJSON: function() {
      var jsonSession = localStorage.getItem(this.localStorageKey),
          prop;

      if (jsonSession) {
        jsonSession = JSON.parse(jsonSession);
      } else {
        return false;
      }

      if (((new Date()).valueOf() - jsonSession.timestamp) > (1000 * 60 * 60)) {
        return false;
      }

      for (prop in jsonSession) {
        if (prop in this.defaults) {
          this.set(prop, jsonSession[prop]);
        }
      }
      return true;
    },

    fetch: function(options) {
      return this.sync('read', this, options);
    },

    sync: function(method, model, options) {

      switch (method) {
        case 'read':
          attemptLogin(model.get('username'), model.get('password'));
          break;
        case 'create':
          saveSession();
          break;
        case 'update':
          saveSession();
          break;
      }

      function attemptLogin(username, password) {
        var params = {
          userId: username,
          password: password
        };

        Acts.call('loginAction', params,
            function(res){
              model.set('sessionId', res.head.sessionId);
              model.set('timestamp', (new Date()).valueOf());
              model.trigger('sync', model, res);
              if (options && options.success) {
                options.success(model, res);
              }
            }, function(err, msg){
              model.set('sessionId', '');
              model.set('timestamp', null);
              model.trigger('error', model, err, msg);
              if (options && options.error) {
                options.error(model, err, msg);
              }
            }
        );
      }

      function saveSession() {
        var self = this;

        localStorage.setItem(this.localStorageKey, JSON.stringify({
          'sessionId': self.get('sessionId'),
          'timestamp': self.get('timestamp')
        }));
      }
    }
  });
});
