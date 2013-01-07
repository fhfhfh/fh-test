define([
    'chai',
    'sinon-chai',
    'sinon',
    'backbone',
    'views/ContainerView'
], function(chai, sinonChai, sinon, Backbone, ContainerView) {
  var expect = chai.expect;

  describe('ContainerView', function() {
    var containerView;

    it('should configure subViews outside of options object', function() {
      var subViews = [
          (new Backbone.View()),
          (new Backbone.View())
      ];

      containerView = new ContainerView({ subViews: subViews });
      expect(containerView.subViews).to.equal(subViews);
    });

    it('should call Backbone\'s standard configuration of properties',
        function() {
          sinon.spy(Backbone.View.prototype, '_configure');
          containerView = new ContainerView();
          expect(Backbone.View.prototype._configure).to.have.been.calledOnce;
          Backbone.View.prototype._configure.restore();
        });

    describe('#remove', function() {

      beforeEach(function() {
        sinon.spy(Backbone.View.prototype, 'remove');
        containerView = new ContainerView();
      });

      afterEach(function() {
        Backbone.View.prototype.remove.restore();
      });

      it('should call remove on all sub-views', function() {
        containerView.subViews = [
          (new Backbone.View()),
          (new Backbone.View())
        ];
        containerView.remove();
        expect(Backbone.View.prototype.remove).to.have.been.calledThrice;
      });

      it('should call Backbone\'s standard remove on itself', function() {
        containerView.remove();
        expect(Backbone.View.prototype.remove).to.have.been.calledOnce;
      });
    });
  });
});
