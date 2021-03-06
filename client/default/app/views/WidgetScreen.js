define([
  'jquery',
  'underscore',
  'backbone',
  'views/ContainerView',
  'views/widgetScreen/Foodometer',
  'views/widgetScreen/BusyBody',
  'views/widgetScreen/MedBot',
  'views/widgetScreen/MyStats',
  'views/widgetScreen/Learning',
  'views/widgetScreen/DrVisits',
  'views/widgetScreen/WellBeing',
  'views/widgetScreen/FoodScreen',
  'views/widgetScreen/ActivityScreen',
  'text!templates/pages/WidgetScreen.html',
  'models/Calendar'
], function($, _, Backbone, ContainerView, Foodometer, BusyBody,
  MedBot, MyStats, Learning, DrVisits,
  WellBeing, FoodScreen, ActivityScreen, template, Calendar) {

  return ContainerView.extend({
    tagName: 'section',
    id: 'widgetScreen',
    calendar: Calendar,
    foodItems: [],
    activityItems: [],
    time: '',

    events: {
      'click #foodometer': 'showFood',
      'click #busyBody': 'showBusyBody',
      'click #medBot': 'showMedBot',
      'click #myStats': 'showMyStats',
      'click #learning': 'showLearning',
      'click #drVisits': 'showDrVisits',
      'click #wellBeing': 'showWellBeing',
      'click #closeBtn': 'close'
    },

    subViews: {
      foodometerNav: new Foodometer(),
      busyBodyNav: new BusyBody(),
      medBotNav: new MedBot(),
      myStatsNav: new MyStats(),
      learningNav: new Learning(),
      drVisitsNav: new DrVisits(),
      wellBeingNav: new WellBeing(),
      foodScreen: new FoodScreen(),
      activityScreen: new ActivityScreen()
    },

    initialize: function(options) {
      var self = this;
      _.bindAll(this);
      this.$el.html(template);
      this.$content = this.$('#childContent');
      this.$nav = this.$('#buttons');

      window.addEventListener('orientationchange', function(e) {
        switch (window.orientation) {
          case 0: // portrait mode
            self.refreshScroll();
            break;
          case 90: // landscape left
            self.refreshScroll();
            break;
          case -90: // landscape right
            self.refreshScroll();
            break;
        }
      });
    },

    render: function() {
      var self = this;
      self.setActiveView(initial);
      this.delegateEvents();
      if (this.activeView) {
        this.activeView.delegateEvents();
      }
      //chop Nav off initial id to get is of button
      var initialButton = '#buttons #' + initial.substr(0, initial.length - 3);
      this.$('li').removeClass('selected');
      this.$(initialButton).addClass('selected');

      // // iScroll ---------------------------
      this.iscroll = new iScroll(this.$('#scrollWrapper')[0], {
        vScroll: true,
        hScrollbar: false,
        vScrollbar: true,
        fixedScrollbar: true,
        bounceLock: true,
        bounce:false,
        // checkDomChanges: false,

        // onBeforeScrollStart: function(e) {
        //   console.log("onBeforeScrollStart");
        //   this.refresh();
        // },

        // onBeforeScrollMove: function(e) {
        //   console.log("onBeforeScrollMove");
        //   this.refresh();
        // },

        onBeforeScrollEnd: function(e) {
          this.refresh();
          console.log("onBeforeScrollEnd ---- REFRESH");
          // }
        }
      });

      // OLD // iScroll- ---------------------------
      // this.iscroll = new iScroll(this.$('#scrollWrapper')[0], {
      //     vscroll: false,
      //     fixedScrollbar: true,
      //     bounce: false,
      //     bounceLock: false,
      //     vScrollbar: true
      // });

      this.refreshScroll();

      return this;
    },

    refreshScroll: function() {
      var self = this;

      if (window.orientation === 0) {
        console.log('window  SCROLL');
      } else {
        setTimeout(function() {
          console.log('refresh SCROLL');
          self.iscroll.refresh();
        }, 0);
      }

    },

    showFood: function() {
      this.$('#buttons li').removeClass('selected');
      this.$('#buttons #foodometer').addClass('selected');
      this.setActiveView('foodometerNav');
      this.refreshScroll();
    },

    showBusyBody: function() {
      this.$('#buttons li').removeClass('selected');
      this.$('#buttons #busyBody').addClass('selected');
      this.setActiveView('busyBodyNav');
      this.refreshScroll();
    },

    showMedBot: function() {
      this.$('#buttons li').removeClass('selected');
      this.$('#buttons #medBot').addClass('selected');
      this.setActiveView('medBotNav');
      this.refreshScroll();
    },

    showMyStats: function() {
      this.$('#buttons li').removeClass('selected');
      this.$('#buttons #myStats').addClass('selected');
      this.setActiveView('myStatsNav');
      this.refreshScroll();
    },

    showLearning: function() {
      console.log("helloLearning");
      this.$('#buttons li').removeClass('selected');
      this.$('#buttons #learning').addClass('selected');
      this.setActiveView('learningNav');
      this.refreshScroll();
    },

    showDrVisits: function() {
      this.$('#buttons li').removeClass('selected');
      this.$('#buttons #drVisits').addClass('selected');
      this.setActiveView('drVisitsNav');
      this.refreshScroll();
    },

    showWellBeing: function() {
      this.$('#buttons li').removeClass('selected');
      this.$('#buttons #wellBeing').addClass('selected');
      this.setActiveView('wellBeingNav');
      this.refreshScroll();
    },

    close: function() {
      // window.history.back();
      this.$el.slideUp(300, function() {
        // var events = this.delegateEvents();
        // setTimeout(function() {
        //     window.history.back();
        // }, 310);
        this.remove();

      });
    }
  });
});
