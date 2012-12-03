require(
  [
    'zepto',
    'underscore',
    'backbone',
    'text!templates/login.tpl'
  ], function($, _, Backbone, loginTemplate) {
  $('body').html(loginTemplate);
});
