// Backbone Router module

define(['zepto',
        'underscore',
        'backbone',
        'text!templates/pages/Login.tpl',
        'views/Login',
        'views/Main'
], function($, _, Backbone, loginTemplate) {


  //interface------------------------------
  Peachy.Router = Backbone.Router.extend({
      
    initialize: _initialize, // Backbone's initializer
    startup   : _startup,    // Function called when no path specified
    login     : _login,      // Function called when path = /login 
    default   : _default,    // Fallback function
    home      : _home,
    routes : {               // Backbone object defining all route bindings
      ''     : 'startup',
      'login': 'login',
      'home' : 'home',
      '*path': 'default'
    }
  });

  //scripts-----------------------------



  //implementations--------------------

    function _initialize() {
      _.bindAll(this);
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
    };

    function _home(){
      new Peachy.Views.Main();
    }


  return Peachy.Router;
});
