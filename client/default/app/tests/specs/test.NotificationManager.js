define([
  'chai',
  'jquery',
  'backbone',
  'NotificationManager'
], function(chai, $, Backbone, NotificationManager) {
  var expect = chai.expect;

  describe('NotificationManager', function() {
    var notificationManager;

    it('should use body as the root element if none given to constructor',
        function() {
          notificationManager = new NotificationManager();
          expect(notificationManager.$el.get(0)).to.equal(document.body);
        });

    it('should accept a jQuery or Zepto object to use as root element',
        function() {
          var rootEl = $('<div/>');
          notificationManager = new NotificationManager({ el: rootEl });
          expect(notificationManager.$el).to.equal(rootEl);
        });

    it('should accept a DOM Node as root element and wrap with $()',
        function() {
          var rootEl = $('<div/>').get(0);
          notificationManager = new NotificationManager({ el: rootEl });
          expect(notificationManager.$el.get(0)).to.equal(rootEl);
        });

    it('should use a string given as root element if it resolves to exactly ' +
        'one element on the page', function() {
      notificationManager = new NotificationManager({ el: '#mocha' });
      expect(notificationManager.$el.get(0)).to.equal($('#mocha').get(0));
    });

    it('should ignore a string given as root element if it doesn\'t resolve ' +
        'to exactly one element', function() {
      notificationManager = new NotificationManager({ el: '#notavalidselector' });
      expect(notificationManager.$el.get(0)).to.equal(document.body);
    });
  });
});
