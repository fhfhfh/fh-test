/**
 * @fileOverview The apps Session model, which handles logging in and out of the
 * application.
 */


define(['underscore', 'backbone', 'feedhenry', 'models/Acts'], function(_, Backbone, $fh, Acts) {

  return Backbone.Model.extend({

    initialize: function() {
      _.bindAll(this);
    },

    defaults: {
      username: '',
      password: '',
      sessionId: '',
      timestamp: null
    },

    sync: function(method, model) {

      switch (method) {
        case 'read':
          attemptLogin(model.get('username'), model.get('password'));
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
            }, function(err, msg){
              model.set('sessionId', '');
              model.set('timestamp', null);
              model.trigger('error', model, err, msg);
            }
        );
      }
    }
  });
});
