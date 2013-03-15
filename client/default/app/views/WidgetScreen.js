/**
 * @fileOverview The 404 Error view of the Peachy app.
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
      'click #closeBtn' : 'close',
      'click .itemBox'  : 'openItem'
    },

    initialize: function() {
      _.bindAll(this);
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    close: function(){
      this.$el.slideUp(300, function(){

      var r =this.delegateEvents();        
      setTimeout(function(){
        window.history.back();
        r;
      },100);

      });
    },

    openItem: function(e){
      var target = $(e.currentTarget);
      $('.itemBox').removeClass('selected');
      target.addClass('selected');
    }
  });
});
