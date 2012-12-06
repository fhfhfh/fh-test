// Backbone Router module

define(['zepto',
        'underscore',
        'backbone',
        'text!templates/login.tpl',
        'views/Login'
], function($, _, Backbone, loginTemplate) {

  //interface------------------------------
  Peachy.Router = Backbone.Router.extend({
    
    routes    : _routes,
    initialize: _initialize,
    startup   : _startup,
    login     : _login,
    default   : _default
  });

  //scripts-----------------------------



  //implementations--------------------
  var _routes = {
      ''     : 'startup',
      'login': 'login',
      '*path': 'default'
    };

    function _initialize() {
      _.bindAll(this);// unclear
    };

    function _startup() {
      // TODO: No backend implementation, so just skipping to login every time.
      this.navigate('login', {
        trigger: true,
        replace: true
      });
    };

    function _login() {
      new Peachy.Views.Login();
    };

    function _default(){
      this.navigate('login', true);
    }


  return Peachy.Router;
});
