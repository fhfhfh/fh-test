// TODO: Should we mock the server requests/responses?

define(['chai', 'sinon-chai', 'sinon', 'models/Session', 'feedhenry'], function(chai, sinonChai, sinon, Session, $fh) {
  var expect = chai.expect;
  chai.use(sinonChai);

  describe('Session model', function() {
    var session = new Session(),
        host = window.location.origin || 'http://127.0.0.1:8888';

    before(function(done) {
      $fh.init({
        host: host,
        appid: 'doesntmatterhere',
        appkey: 'doesnmatterhere',
        mode: 'dev'
      }, function(res) {
        done();
      }, function(msg, err) {
        throw new Error('$fh init failed!');
      });
    });

    describe('when fetch is called with valid credentials', function() {
      before(function() {
        session.set('username', 'jsmith101');
        session.set('password', '12345');
      });

      it('should trigger the sync event with expected parameters', function(done) {
        var syncSpy = sinon.spy();

        session.once('sync', syncSpy);

        function success(model, res) {
          session.off();
          expect(syncSpy).to.have.been.calledWith(model, res);
          done();
        }
        function error() {
          session.off();
          throw new Error('Fetch failed!');
        }

        session.once('sync', success);
        session.once('error', error);
        session.fetch();
      });

      it('should set the sessionId of the model', function(done) {

        function success(model, res) {
          session.off();
          expect(session.get('sessionId')).to.eql(res.head.sessionId);
          done();
        }
        function error() {
          session.off();
          throw new Error('Fetch failed!');
        }

        session.once('sync', success);
        session.once('error', error);
        session.fetch();
      });

      it('should set the timestamp to current time', function(done) {

        function success(model, res) {
          session.off();
          expect(session.get('timestamp')).to.be.closeTo((new Date()).valueOf(), 1000);
          done();
        }
        function error() {
          session.off();
          throw new Error('Fetch failed!');
        }

        session.once('sync', success);
        session.once('error', error);
        session.fetch();
      });
    });

    describe('when fetch is called with invalid credentials', function() {
      it('should trigger the error event with expected parameters', function(done) {
        var errorSpy = sinon.spy();

        session.once('error', errorSpy);

        session.set('username', 'user-doesnt-exist');
        session.set('password', 'invalid-password');

        function success(model, res) {
          session.off();
          throw new Error('Fetch succeeded!');
        }
        function error(model, err, msg) {
          session.off();
          expect(errorSpy).to.have.been.calledWith(model, err, msg);
          done();
        }

        session.once('sync', success);
        session.once('error', error);
        session.fetch();
      });

      it('should clear the sessionId of the model', function(done) {
        session.set('username', 'user-doesnt-exist');
        session.set('password', 'invalid-password');

        function success(model, res) {
          session.off();
          throw new Error('Fetch succeeded!');
        }
        function error() {
          throw new Error('Forced error...');
          session.off();
          expect(session.get('sessionId')).to.not.be.ok;
          done();
        }

        session.once('sync', success);
        session.once('error', error);
        session.fetch();
      });

      it('should clear the timestamp', function(done) {

        function success(model, res) {
          session.off();
          throw new Error('Fetch succeeded!');
        }
        function error() {
          session.off();
          expect(session.get('timestamp')).to.not.be.ok;
          done();
        }

        session.once('sync', success);
        session.once('error', error);
        session.fetch();
      });
    });
  });
});
