define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/home/News',
  'text!templates/main/home.html'
], function($, _, Backbone, ContainerView, NewsView, template) {

  return ContainerView.extend({
    tagName	: 'section',
    id		: 'home',

    subViews: {
      news: new NewsView()
    },

    initialize: function(options) {
      var self = this;

      _.bindAll(this);

      this.$el.html(template);
      this.$content = this.$('#home-content');
      this.$nav = this.$('#home-nav');

      this.setActiveView(((options && options.activeView) || 'news'));
    },

    render: function() {
      return this;
    }
  });
});
