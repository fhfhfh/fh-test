define([
    'jquery',
    'underscore',
    'backbone',
    'views/ContainerView',
    'views/widgetScreen/Foodometer',
    'text!templates/pages/WidgetScreen.html',
    'models/Calendar'
], function($, _, Backbone, ContainerView, Foodometer, template, Calendar) {

    return ContainerView.extend({
        tagName : 'section',
        id      : 'widgetScreen',
        calendar  : Calendar,

        events : {
          'click #foodometer': 'showFood',
          'click #busyBody'  : 'showBusyBody',
          'click #medBot'    : 'showMedBot',
          'click #myStats'   : 'showMyStats',
          'click #closeBtn'  : 'close'
        },

        subViews: {
          foodometer  : new Foodometer()
        },

        initialize: function(options) {
            var self = this;
            _.bindAll(this);

            this.$el.html(template);
            this.$content = this.$('#childContent');
            this.$nav = this.$('#buttons');    

            // // iScroll ---------------------------
            // this.iscroll = new iScroll(this.$('#profile-iscroll')[0], {
            //     hscroll: false,
            //     fixedScrollbar: true,
            //     bounce: false,
            //     vScrollbar: false
            // });   
        },

        render: function() {
          var self = this;
          
          self.setActiveView('foodometer');  
          this.delegateEvents();
          if (this.activeView) {
            this.activeView.delegateEvents();
          }
          this.$('li').removeClass('selected');
          this.$('#buttons #foodometer').addClass('selected');

          return this;
        },

        refreshScroll: function(){
          var self = this;
          if(this.iscroll){
          this.iscroll.refresh.call(self.iscroll);        
          }
        },

        showFood : function(){
          this.$('#buttons li').removeClass('selected');
          this.$('#buttons #foodometer').addClass('selected');
          this.setActiveView('foodometer');
          this.refreshScroll();
        },

        showBusyBody : function(){
          this.$('#buttons li').removeClass('selected');
          this.$('#buttons #busyBody').addClass('selected');
          this.setActiveView('foodometer');
          this.refreshScroll();
        },

        showMedBot : function(){
          this.$('#buttons li').removeClass('selected');
          this.$('#buttons #medBot').addClass('selected');
          this.setActiveView('foodometer');
          this.refreshScroll();
        },

        showMyStats : function(){
          this.$('#buttons li').removeClass('selected');
          this.$('#buttons #myStats').addClass('selected');
          this.setActiveView('foodometer');
          this.refreshScroll();
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
    });
});
