// Backbone Router module

define(['zepto',
        'underscore',
        'backbone',
        'text!templates/login.tpl',
        'views/Login'
], function($, _, Backbone, loginTemplate) {

  //interface------------------------------
  Peachy.Router = Backbone.Router.extend({
      
    initialize: _initialize, //Backbone's initializer
    startup   : _startup,    // Function called when no path specified
    login     : _login,      // Function called when path = /login 
    default   : _default,
    routes : {
      ''     : 'startup',
      'login': 'login',
      '*path': 'default'
    }
  });

  //scripts-----------------------------



  //implementations--------------------

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
