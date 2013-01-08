// TODO: Should we mock the server requests/responses?

define(['chai', 'sinon-chai', 'sinon', 'models/Session', 'feedhenry'], function(chai, sinonChai, sinon, Session, $fh) {
  var expect = chai.expect;
  chai.use(sinonChai);

  describe('Session (model)', function() {
    var session,
        host = window.location.origin || 'http://127.0.0.1:8888';

    before(function(done) {
      $fh.init({
        host: host,
        appid: 'doesntmatterhere',
        appkey: 'doesnmatterhere',
        mode: 'dev'
      }, function(res) {
        session = new Session();
        done();
      }, function(msg, err) {
        throw new Error('$fh init failed!');
      });
    });

    describe('#fetch', function() {
      describe('with valid credentials', function() {
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

      describe('with invalid credentials', function() {
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

    describe('#getFromLocalStorage', function() {

      beforeEach(function() {
        localStorage.removeItem('peachy_session');
      });

      it('should return false if no saved session exists', function() {
        var result = session.getFromJSON();
        expect(result).to.be.false;
      });

      it('should return false if timestamp is over an hour old', function() {
        var mockSession = {
          timestamp: (new Date()).valueOf() - (1000 * 60 * 61)
        };

        localStorage.setItem('peachy_session', JSON.stringify(mockSession));

        var result = session.getFromJSON();
        expect(result).to.be.false;
      });

      it('should return true if item is present and timestamp OK', function() {
        var mockSession = {
          timestamp: (new Date()).valueOf() - (1000 * 60 * 30)
        };

        localStorage.setItem('peachy_session', JSON.stringify(mockSession));

        var result = session.getFromJSON();
        expect(result).to.be.true;
      });

      it('should set model properties from data if all OK', function() {
        var timestamp = (new Date()).valueOf() - (1000 * 60 * 30),
          mockSession = {
            timestamp: timestamp
          };

        localStorage.setItem('peachy_session', JSON.stringify(mockSession));

        session.getFromJSON();
        expect(session.get('timestamp')).to.eql(timestamp);
      });

      it('should only set properties from data that exist in defaults',
          function() {
            var timestamp = (new Date()).valueOf() - (1000 * 60 * 30),
                mockSession = {
                  timestamp: timestamp,
                  username: 'someuser',
                  badProp: 'what is this?'
                };

            localStorage.setItem('peachy_session', JSON.stringify(mockSession));

            session.getFromJSON();
            expect(session.get('timestamp')).to.eql(timestamp);
            expect(session.get('username')).to.eql('someuser');
            expect(session.get('badProp')).to.not.be.ok;
          });
    });
  });
});
