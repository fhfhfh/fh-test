/**
 * @fileOverview The Widgets Screen Container
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/pages/Foodometer.html', 
], function($, _, Backbone, tpl) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'widgetScreen',
        template: _.template(tpl),
        events: {
            'click #closeBtn': 'close',
            'click .itemBox': 'openItem'
        },

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        close: function() {
            // window.history.back();
            this.$el.slideUp(300, function() {
                // var events = this.delegateEvents();
                // setTimeout(function() {
                //     window.history.back();
                // }, 310);

            });
        },

        openItem: function(e) {
            var target = $(e.currentTarget);
            $('.itemBox').removeClass('selected');
            target.addClass('selected');
        }
    });
});