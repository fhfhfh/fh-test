/**
 * @fileOverview The apps Session model, which handles logging in and out of the
 * application as well as session management.
 */


define([
'underscore',
'backbone',
'feedhenry',
'models/Store'
], function(_, Backbone, $fh, Store) {

  var Session = Backbone.Model.extend({

    storageKey: 'peachy_session',

    // The amount of time, in milliseconds, that the session remains valid for.
    timeout: 1000 * 60 * 60,
    video: 'null',

    initialize: function() {
      _.bindAll(this);
    },

    idAttribute: 'sessionId',

    /**
     * Check to ensure a session is within it's timeout period. If no timestamp
     * is given, checks against itself.
     *
     * @param {number} [timestamp] A result of Date.valueOf() to check against.
     * @return {boolean} Whether the session should be valid or not.
     */
    isValid: function(timestamp) {
      timestamp = timestamp || this.get('timestamp') || 0;
      return ((new Date()).valueOf() - timestamp) < this.timeout;
    },

    /**
     * A nice interface for attempting to login to the app. Basically delegates
     * to fetch. If all parameters aren't provided, it becomes a no-op.
     *
     * @param {string} username The username given by the user.
     * @param {string} password The password given by the user.
     * @param {object} callbacks A 'success' and 'error' callback are expected.
     */
    login: _.throttle(function(username, password, callbacks) {
      var options;

      if (!username || !password ||
          !callbacks || !callbacks.success || !callbacks.error) {
        return;
      }

      options = callbacks;
      options.username = username;
      options.password = password;

      this.fetch(options);
    }, 750),

    /**
     * Kills the current session by clearing our attributes and removing from
     * localStorage. Triggers a 'logout' event on the Backbone object to allow
     * the router to listen for this and route to login.
     */
    logout: function() {
      var self = this;
      
      this.clear();
      // localStorage.removeItem(this.storageKey);
      Store.clear(self.storageKey, function(){});
      Backbone.trigger('logout');
    },

    sync: function(method, model, options) {
      var self = this;

      switch (method) {
        case 'read':
          attemptLogin();
          break;
        case 'create':
          saveSession();
          break;
        case 'update':
          saveSession();
          break;
      }

      function attemptLogin() {
        $fh.act({
          act: 'loginAction',
          req: {
            request: {
              head: {},
              payload: {
                login: {
                  userId: options.username,
                  password: options.password
                }
              }
            }
          }
        }, function(res) {
          options.success(model, res, options);
          avatar_id = res.response.payload.userDetails.avatarId;
          self.trigger('sync', model, res, options);
          saveSession();

        }, function(err, msg) {
          var theError = {
            err: err,
            msg: msg
          };
          options.error(model, theError, options);
          self.trigger('error', model, theError, options)
        });
      }

      // TODO: Make this more compliant with what Backbone expects...
      function saveSession() {

        Store.save(self.storageKey, self.get('id'), function(){});

        // localStorage.setItem(self.storageKey, self.toJSON());
        // options.success(model, {
        //   head: {
        //     sessionId: self.get('id')
        //   }
        // }, options);
      }
    },

    parse: function(res) {
      // check video status ---------------
      var flag = res.response.payload.userDetails.postLoginVideo;
      var url = res.response.payload.userDetails.postLoginVideoUrl;
      var newData = res.response.payload.userDetails.newDataValidation;
      var video = null;

      if(flag == 1){
        video = url;
      }
      // ----------------------------------

      return {
        id: res.response.head.sessionId,
        timestamp: (new Date()).valueOf(),
        userProfile: res.response.payload,
        video: video,
        newData: newData
      };
    }
  });

  return new Session();
});
