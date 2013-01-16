/**
 * @fileOverview The apps Session model, which handles logging in and out of the
 * application.
 */


define(['underscore', 'backbone', 'feedhenry', 'controllers/Login'], function(_, Backbone, $fh, LoginController) {

  return Backbone.Model.extend({

    localStorageKey: 'peachy_session',

    // The amount of time, in milliseconds, that the session remains valid for.
    timeout: 1000 * 60 * 60,

    initialize: function() {
      _.bindAll(this);
      this.getFromJSON();
      console.log('SESSSSION');

      this.loginController = new LoginController();
    },

    defaults: {
      sessionId: '',
      timestamp: 0
    },

    /**
     * Check to ensure a session is within it's timeout period. If no timestamp
     * is given, checks against itself.
     *
     * @param {number} [timestamp] A result of Date.valueOf() to check against.
     * @return {boolean} Whether the session should be valid or not.
     */
    isValid: function(timestamp) {
      timestamp = timestamp || this.get('timestamp');
      return ((new Date()).valueOf() - timestamp) < this.timeout;
    },

    /**
     * Will attempt to set the session from localStorage, if a session exists
     * there and if that session is within the timeout period.
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

      if (this.isValid(jsonSession.timestamp)) {
        for (prop in jsonSession) {
          if (prop in this.defaults) {
            this.set(prop, jsonSession[prop]);
          }
        }
        return true;
      } else {
        return false;
      }
    },

    /**
     * A nice interface for attempting to login to the app. Basically delegates
     * to fetch. If all parameters aren't provided, it becomes a no-op.
     *
     * @param {string} username The username given by the user.
     * @param {string} password The password given by the user.
     * @param {object} callbacks A 'success' and 'error' callback are expected.
     */
    login: function(username, password, callbacks) {
      var options;

      if (!username || !password ||
          !callbacks || !callbacks.success || !callbacks.error) {
        return;
      }

      options = callbacks;
      options.username = username;
      options.password = password;
      this.fetch(options);
    },

    logout: function() {
      this.set('sessionId', '');
      this.set('timestamp', 0);
      localStorage.removeItem(this.localStorageKey);
    },

    fetch: function(options) {
      return this.sync('read', this, options);
    },

    save: function() {
      return this.sync('create', this);
    },

    sync: function(method, model, options) {

      switch (method) {
        case 'read':
          attemptLogin(options);
          break;
        case 'create':
          saveSession();
          break;
        case 'update':
          saveSession();
          break;
      }

      function attemptLogin(options) {
        var user = options.username;
        var pass = options.password;
        // var params = {
        //   userId: options.username,
        //   password: options.password
        // };


        loginController.login(user, pass, function(bool, res){
          if(bool === true){
            model.set('sessionId', res.head.sessionId);
            model.set('timestamp', (new Date()).valueOf());
            model.trigger('sync', model, res);
            options.success();
          } else {
            model.set('sessionId', '');
            model.set('timestamp', null);
            model.trigger('error', model, err, msg);
            options.error(err, msg);
          }
        });
        // Acts.call('loginAction', params,
        //     function(res){
        //       model.set('sessionId', res.head.sessionId);
        //       model.set('timestamp', (new Date()).valueOf());
        //       model.trigger('sync', model, res);
        //       options.success();
        //     }, function(err, msg){
        //       model.set('sessionId', '');
        //       model.set('timestamp', null);
        //       model.trigger('error', model, err, msg);
        //       options.error(err, msg);
        //     }
        // );
      }

      function saveSession() {
        localStorage.setItem(this.localStorageKey, this.toJSON());
      }
    }
  });
});
