// There are some important caveats when testing Backbone Routers that should be
// noted here:
//
//   - It's impossible to spy or stub a method called from a Router matching a
//     route in any manageable way, making the only way of testing a routes
//     function being to test for it's resulting DOM (or other) side-effects.
//     See http://goo.gl/Lj53V
//
//   - In order to facilitate browser refreshing etc. of tests, we stub the
//     relevant address-bar location editing functions. There may come a time in
//     future when browsers make the native window.history.* function references
//     non-mess-with-able, so keep this in mind and change code if this ever
//     pops up as an issue. You should NEVER see the location in the address-bar
//     change when running your tests!

define([
  'chai',
  'sinon-chai',
  'sinon',
  'jquery',
  'backbone',
  'routers/AppRouter'
], function(chai, sinonChai, sinon, $, Backbone, AppRouter) {
  chai.use(sinonChai);
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

  describe('AppRouter', function() {
    var appRouter = new AppRouter({ testMode: true }),
        stubbedMainFuncs = [],
        stubbedTestFuncs = [],
        $content = $('#content');

    function restoreStubbedFuncs(funcArray) {
      var stubbedFunc;
      while (funcArray.length > 0) {
        stubbedFunc = funcArray.pop();
        stubbedFunc.restore();
      }
    }

    // Kill the default location editing of Backbone's navigation methods...
    // this allows us to test & fire location routes as normal, without botching
    // the address in our URL bar, for refreshing tests repeatedly.
    before(function() {
      stubbedMainFuncs.push(sinon.stub(Backbone.history.history, 'pushState'));
      stubbedMainFuncs.push(sinon.stub(Backbone.history.history, 'replaceState'));
      stubbedMainFuncs.push(sinon.stub(Backbone.history, '_updateHash'));
    });

    // Restore usual Backbone history functionality... no tests should leave
    // side-effects which may affect further tests!
    after(function() {
      restoreStubbedFuncs(stubbedMainFuncs);
    });

    describe('when logged in', function() {
      afterEach(function() {
        restoreStubbedFuncs(stubbedTestFuncs);
      });

      it('should route to 404 for any invalid URL request');
      it('should call home for /');
      it('should call home for /home');
    });

    describe('when not logged in', function() {
      afterEach(function() {
        restoreStubbedFuncs(stubbedTestFuncs);
      });

      it('should route to 404 for any invalid URL request');
      it('should route to login for any valid URL request when not logged in', function() {
        appRouter.navigate('home', true);
        forceReflow();
        expect($content.find('#login')).to.have.length(1);
      });
      it('should pass requested URL to login function for proper routing later');
    });
  });
});
