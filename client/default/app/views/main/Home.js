define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/main/home/News',
  'views/main/home/Goals',
  'views/main/home/Alerts',
  'text!templates/pages/Home.html',
  'models/Acts'
], function($, _, Backbone, ContainerView, NewsView, GoalsView, AlertsView, template, Act) {

  return ContainerView.extend({
    tagName	: 'section',
    id		: 'home',

    events : {
      'click #show-news' : 'showNews',
      'click #show-alerts' : 'showAlerts',
      'click #show-goals' : 'showGoals'
    },

    subViews: {
      news  : new NewsView(),
      goals : new GoalsView(),
      alerts: new AlertsView()
    },

    initialize: function(options) {
      var self = this;

      _.bindAll(this);

      
      // this.setElement( this.el );
      this.$el.html(template);
      this.$content = this.$('#home-content');
      this.$nav = this.$('#home-nav');
      this.$('#show-news').addClass('selected');

      this.setActiveView(((options && options.activeView) || 'news'));
    },

    render: function() {
      var self = this;
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
      }
      console.log('||||||||||');
      return this;
    },

    showNews : function(){
      this.$('li').removeClass('selected');
      this.$('#show-news').addClass('selected');
      this.setActiveView('news');
    },

    showAlerts : function(){
      this.$('li').removeClass('selected');
      this.$('#show-alerts').addClass('selected');
      this.setActiveView('alerts');
    },

    showGoals : function(){
      this.$('li').removeClass('selected');
      this.$('#show-goals').addClass('selected');
      this.setActiveView('goals');
    },

    fetchInfo: function(){
      var newsArr = [];

      // Act.call('fetchNewsAction', {}, 
      //   function(res){
      //     newsArr = res.payload.News;
      //     console.log(newsArr);
      //   }, function(err, msg){
      //     console.log(err, msg);
      //   });

      var arr = [];
      for(var i = 0; i<newsArr.length; i++){
        var item = newsArr[i];
        arr.push(
          new NewsItem({  title       : item[title], 
                          description : item[description],
                          newsId      : item[newsId],
                          url         : item[url]
                        })
          );
      }

      var news = this.subViews.news;
      console.log(news);
      news.collection.add(arr);
      // NewsView.addArray(arr);
      console.log(news);
      console.log(arr);
    }
  });
});
