require(
  [
    'zepto',
    'underscore',
    'backbone',

    // //------------ Backbone Files -----------------//
    '../app/app.js',
    // '../app/router.js',
    // '../app/namespace.js',


    //------------ Page Templates -----------------//
    'text!../templates/pages/Login.tpl',
    // 'text!../templates/pages/Home.tpl',


    // //------------ Component Templates------------//
    // 'text!../templates/components/TopBar.tpl'


  ], function($, _, Backbone, loginTemplate) {
  $('body').html(loginTemplate);
});
