define([
    'jquery',
    'underscore',
    'backbone',
    'views/ContainerView',
    'views/widgetDetails/Widget1',
    'text!templates/pages/WidgetDetails.html',
    'models/Calendar'
], function($, _, Backbone, ContainerView, Widget1, template) {

    return ContainerView.extend({
        tagName : 'section',
        id      : 'widgetScreen',
        events : {
           'click #quit'  : 'close'
         },

        subViews: {
          widget1  : new Widget1()
        },

        initialize: function(options) {
            var self = this;
            _.bindAll(this);

            this.$el.html(template);
            this.$content = this.$('#widgets-content');

        },

        render: function() {
          var self = this;
          self.setActiveView(initial);
          this.delegateEvents();
          if (this.activeView) {
            this.activeView.delegateEvents();
          }

          return this;
        },

        close: function() {
             // window.history.back();
              this.$el.slideUp(300, function() {
              this.remove();

            });
        }
    });
});
