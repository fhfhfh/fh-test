/**
 * @fileOverview The Food selection screen
 * SubView of FoodScreen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/ActivityScreen/BusyBody.html',
    'text!templates/widgets/ActivityItem.html',
    'collections/Activities',
    'collections/ActivityJournal',
    'models/Clock'
], function($, _, Backbone, tpl, activityItem, collection, journal, Clock) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'activityListScreen',
        collection: collection,
        template: _.template(tpl),
        itemTpl: _.template(activityItem),
        clock: new Clock(),
        timer: {},
        events: {
            'click .activityItem': 'selectActivity',
            'click #activityList .boxEntry': 'showActivityItemScreen',
            'click #backToTop': 'backToTop',
            'click .item': 'selectItem',
            'click #cancelActivity': 'cancelActivity',
            'click #activityFavBtn': 'addActivityToFav',
            'click #saveToTime': 'saveActivityToTime',
            'click #saveBtn': 'saveAllItems',
            'change #minutes': 'calculateNutrients',
            'click #startStop': 'startStopClock',
            'click #reset': 'resetClock',
            'keyup': 'detectKeyPressed'
        },

        initialize: function() {
            _.bindAll(this);
            this.initOriHandler();
        },

        initOriHandler: function(e) {
            var self = this;

            window.addEventListener('orientationchange', function(e) {
                switch (window.orientation) {
                    case 0: // Portait mode
                        self.refreshScroll();
                        break;
                    case 90: // landscape left
                        self.refreshScroll();
                        break;
                    case -90: // landscape right
                        self.refreshScroll();
                }
            });
        },

        detectKeyPressed: function(e) {
            // hide keyboard if return 
            if (e.keyCode === 13) {
                $('#activityScreen').find('#activityItemScreen').find('#minutes').blur();
                console.log("Return pressed, hiding keyboard");
            }
        },

        render: function() {
            var self = this;
            this.$el.html(this.template());

            this.level1Scroll = new iScroll(this.$('#level1Activity')[0], {
                vScroll: false,
                hScrollbar: false,
                // bounceLock: true,
                checkDomChanges: false
            });

            this.time = this.container.time;

            $('#filterButtons').show();
            this.pageScroll = new iScroll(this.$('#pageScroll')[0]);
            // this.pageScroll = new iScroll(this.$('#pageScroll')[0], {
            //     hScroll: false,
            //     vScroll: true,
            //     hScrollbar: true,
            //     bounceLock: false,
            //     bounce: true
            // });

            $("span#time").text(self.time + " - (" + this.container.container.activityItems.length + ")");
            this.refreshScroll();
            return this;
        },

        refreshScroll: function() {
            var self = this;
            setTimeout(function() {
                self.level1Scroll.refresh();
                self.pageScroll.refresh();
            }, 100);
        },

        hideCategories: function() {
            $('#activityList').hide();
            $('.activity2').hide();
            if ($('.activityItem.lv1.selected img').attr('src')) {
                $('.activityItem.lv1.selected img').attr('src', $('.activityItem.lv1.selected img').attr('src').replace(".png", "-white.png"));
            }
            $('.activityItem.lv1').removeClass('selected');
        },

        /* 
         * Event when a food category is selected
         * Check whether it is level1 or level2 category
         */
        selectActivity: function(e) {
            var self = this;
            var target = $(e.currentTarget);

            if (target.hasClass('lv1')) {
                if ($(".activityItem.lv1.selected").length > 0) {
                    $('.activityItem.lv1.selected img').attr('src', $('.activityItem.lv1.selected img').attr('src').replace(".png", "-white.png"));
                    $('.activityItem.lv1').removeClass('selected');
                }

                target.find('img').attr('src', target.find('img').attr('src').replace("-white", ""));
                var name = target.attr('data-id');

                $('.activity2').hide();
                $('.activity2.' + name).show();
                $('#activityList').hide();
                $('#backToTop').hide();
            } else if (target.hasClass('lv2')) {
                $('.activityItem.lv2').removeClass('selected');
            }

            target.addClass('selected');

            // if both level categories are selected, show foodList
            if ($('.activityItem.lv1').hasClass('selected') && $('.activityItem.lv2:visible').hasClass('selected')) {
                // $('#foodList').show();
                self.populateActivityList(target);
            }
            this.refreshScroll();
        },

        showActivityItemScreen: function(e) {
            var self = this;
            var target = $(e.currentTarget);
            var imgSrc = $(".lv2.selected img").attr("src");
            var id = target.attr('data-id');
            var model = this.collection.get(id);
            this.model = model;

            //this.pageScroll = null;
            self.selectedActivity = model;
            self.container.container.iscroll.enable();
            self.oldHtml = this.$el.html();
            $('#filterButtons').hide();
            this.$el.html(self.itemTpl({
                item: model.attributes,
                imgSrc: imgSrc
            }));
            this.calculateNutrients();
            self.refreshScroll();

            $('#timerMsg').css('white-space', 'nowrap');

            if (model.attributes.favorite === true) {
                $('#activityFavBtn').addClass('active');
            }
        },

        populateActivityList: function(el) {
            var self = this;
            var target = $(el);
            var name = target.attr('data-name');
            console.log(name);
            $('#activityList').html('');
            $('#modalMask').show().append("<img src='img/spinner.gif'/>");


            // pull foods into collection before populating screen
            this.collection.getActivities(name, function(err, res) {
                if (err) {
                    Backbone.trigger('notify', err, 'Error getting Activity List');
                    $('#modalMask').hide().html("");
                    return;
                }
                console.log(res[0]);
                $('#activityList').show();
                for (var i = 0; i < res.length; i++) {
                    var item = res[i];
                    var name = item.activity || item.attributes.activity;
                    var html = "<div class='boxEntry' data-id='" + item.id + "''><span id='name'>" + name + "</span>" +
                        "<span id='about'>" + "</span></div>";
                    $('#activityList').append(html);
                }
                self.container.container.iscroll.disable();
                $('#modalMask').hide().html("");
                $('#backToTop').show();
                self.refreshScroll();
            });
        },

        backToTop: function() {
            this.pageScroll.scrollTo(0, 0, 200);
        },

        selectItem: function(e) {
            var target = $(e.currentTarget);
            target.toggleClass('selected');
        },

        cancelActivity: function(doneFlag) {
            this.model = null;
            this.selectedActivity = null;
            this.$el.html(this.oldHtml);
            $('#filterButtons').show();


            if (!doneFlag) {
                this.pageScroll = new iScroll(this.$('#pageScroll')[0]);
                this.level1Scroll = new iScroll(this.$('#level1Activity')[0], {
                    hScroll: true,
                    vScroll: false,
                    hScrollbar: false,
                    bounceLock: true,
                    bounce: false
                });
            }
            this.refreshScroll();

        },

        addActivityToFav: function(e) {
            var target = $(e.currentTarget);
            var activity = this.selectedActivity;
            if (!activity) {
                console.warn('No Activity Selected');
                return;
            } else {
                activity.set("favorite", true);
                target.addClass('active');
            }
        },

        saveActivityToTime: function() {
            var self = this;
            var activity = this.selectedActivity;
            if (!activity) {
                console.warn('No Activity Selected');
                return;
            } else {
                var mins = parseInt($("#minutes").val());
                var cals = parseFloat($('#calBurned').val());
                console.log('mins', mins, cals);
                activity.set("recent", true);
                activity.set('calories', mins * cals);
                activity.set('minutes', mins);
                this.container.container.activityItems.push(activity);
            }
            $("span#time").text(self.time + " - (" + this.container.container.activityItems.length + ")");
            this.cancelActivity();
        },

        saveAllItems: function() {
            this.container.container.subViews.busyBodyNav.saveActivitiesToJournal();
            this.container.container.setActiveView('busyBodyNav');

        },

        // When minutes number changes, recalculate calories
        calculateNutrients: function() {
            var minutes = $('#minutes').val();
            var att = this.model.attributes;
            var calories = parseFloat(att.calorieBaseline) || 0;

            var el = $("#nutritionInfo");
            el.find("#totalCalories #amount").text(calories * minutes);
            this.updateNutrition();
        },

        updateNutrition: function() {
            var el = $("#nutritionInfo .boxEntry");

            for (var i = 0; i < el.length; i++) {
                var thisEl = $(el[i]);
                var percent = thisEl.find("#rda").text() || "0%";
                thisEl.find("#name").css("background-size", percent + " 100%");
            }
        },

        startStopClock: function() {
            var self = this;
            var clock = this.clock;
            if (clock.isRunning()) {
                console.log('stopping clock');
                clearInterval(self.timer);
                clock.stop();
            } else {
                self.timer = setInterval(function() {
                    time = clock.tick();
                    $('#stopWatch #time').html(time);
                }, 1000);
            }

        },

        resetClock: function() {
            this.clock.reset();
            clearInterval(this.timer);
            $('#stopWatch #time').html("00:00:00");
        }

    });
});