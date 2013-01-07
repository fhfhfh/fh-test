define([
    'chai',
    'jquery',
    'views/Login'
], function(chai, $, LoginView) {
  var expect = chai.expect;

  /**
   * Forces a synchronous DOM re-flow/paint.
   *
   * Useful when trying to test the presence of an element immediately after it
   * should have been inserted; browsers intelligently defer and group DOM
   * edits, causing issues in some cases like these.
   */
  function forceReflow() {
    var dummyVar = document.body.offsetHeight;
  }

  describe('Login View', function() {
    var loginView = new LoginView(),
        $content = $('#content');


    it('should show username & password fields', function() {
      $content.html(loginView.render().el);
      forceReflow();
      expect($content.find('input#username')).to.have.length(1);
      expect($content.find('input#password')).to.have.length(1);
    });

    it('should disable login button until both have test entered', function() {
      var $username = $('#username'),
          $password = $('#password'),
          $button = $('#signin');

      $username.val('').change();
      $password.val('').change();
      expect($button.prop('disabled')).to.be.ok;

      $username.val('some-user').change();
      expect($button.prop('disabled')).to.be.ok;

      $password.val('some-password').change();
      expect($button.prop('disabled')).to.not.be.ok;
    });
  });
});
