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
            'click .activityItem'          : 'selectActivity',
            'click #activityList .boxEntry': 'showActivityItemScreen',
            'click #backToTop'         : 'backToTop',
            'click .item'              : 'selectItem',
            'click #cancelFood'        : 'cancelActivity',
            'click #foodFavBtn'        : 'addActivityToFav',
            'click #saveToMeal'        : 'saveActivityToTime',
            'click #saveBtn'           : 'saveAllItems',
            'change #serving'          : 'calculateNutrients',
            'click #startStop'         : 'startStopClock',
            'click #reset'             : 'resetClock'
        },

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            var self = this;
            this.$el.html(this.template());

            this.level1Scroll = new iScroll(this.$('#level1Activity')[0],{
                hScroll     : true,
                vScroll     : false,
                hScrollbar  : false,
                bounceLock  : true,
                bounce      : false
            });

            this.time = this.container.time;

            $('#filterButtons').show();
            this.pageScroll = new iScroll(this.$('#pageScroll')[0]);
            $("span#time").text(self.time+" - ("+this.container.container.activityItems.length+")");
            this.refreshScroll();
            return this;
        },

        refreshScroll: function(){
            var self = this;
            setTimeout(function(){
                self.level1Scroll.refresh();
                self.pageScroll.refresh();
            }, 100);
        },

        /* 
         * Event when a food category is selected
         * Check whether it is level1 or level2 category
         */
        selectActivity: function(e){
            var self = this;
            var target = $(e.currentTarget);

            if(target.hasClass('lv1')){
                if($(".activityItem.lv1.selected").length > 0){
                    $('.activityItem.lv1.selected img').attr('src', $('.activityItem.lv1.selected img').attr('src').replace(".png", "-white.png"));
                    $('.activityItem.lv1').removeClass('selected');
                }

                target.find('img').attr('src', target.find('img').attr('src').replace("-white", ""));
                var name = target.attr('data-id');

                $('.activity2').hide();
                $('.activity2.'+name).show();
                $('#activityList').hide();
                $('#backToTop').hide();
            }
            else if(target.hasClass('lv2')){
                $('.activityItem.lv2').removeClass('selected');
            }

            target.addClass('selected');

            // if both level categories are selected, show foodList
            if($('.activityItem.lv1').hasClass('selected') && $('.activityItem.lv2:visible').hasClass('selected')){
                // $('#foodList').show();
                self.populateActivityList(target);
            }
            this.refreshScroll();
        },

        showActivityItemScreen: function(e){
            var self = this;
            var target = $(e.currentTarget);
            var imgSrc = $(".lv2.selected img").attr("src") || "sdf";
            var id = target.attr('data-id');
            var model = this.collection.get(id);
            this.model = model;

            model = {attributes:{fullname: 'Eoins Marathon',calBurned:200}};
            //this.pageScroll = null;
            self.selectedActivity = model;
            self.container.container.iscroll.enable();
            self.oldHtml = this.$el.html();
            $('#filterButtons').hide();
            this.$el.html(self.itemTpl({item:model.attributes, imgSrc:imgSrc}));
            this.calculateNutrients();
            self.refreshScroll();

            if(model.attributes.favorite === true){
                $('#activityFavBtn').addClass('active');
            }
        },

        populateActivityList: function(el){
            var self = this;
            var target = $(el);
            var name = target.attr('data-name');
            console.log(name);
            $('#activityList').html('');
            $('#modalMask').show().append("<img src='img/spinner.gif'/>");


            // pull foods into collection before populating screen
            this.collection.getActivities(name, function(err,res){
                if(err){
                    Backbone.trigger('notify', err, 'Error getting Activity List');
                    $('#modalMask').hide().html("");
                    return;
                }
                console.log(res[0]);
                $('#activityList').show();
                for(var i=0;i<res.length;i++){
                    var item = res[i];
                    var name = item.name || item.attributes.name;
                    var html = "<div class='boxEntry' data-id='"+item.id+"''><span id='name'>" +name +"</span>"+
                                "<span id='about'>" + "</span></div>";
                    $('#foodList').append(html);
                }
                self.container.container.iscroll.disable();
                $('#modalMask').hide().html("");
                $('#backToTop').show();
                self.refreshScroll();
            });
        },

        backToTop: function(){
            this.pageScroll.scrollTo(0,0,200);
        },

        selectItem: function(e){
            var target = $(e.currentTarget);
            target.toggleClass('selected');
        },

        cancelActivity: function(){
            this.model = null;
            this.selectedActivity = null;
            this.$el.html(this.oldHtml);
            $('#filterButtons').show();
            this.level1Scroll.destroy();
            this.pageScroll = new iScroll(this.$('#pageScroll')[0]);
            this.level1Scroll = new iScroll(this.$('#level1Activity')[0],{
                hScroll     : true,
                vScroll     : false,
                hScrollbar  : false,
                bounceLock  : true,
                bounce      : false
            });
            this.container.container.iscroll.disable();
            this.refreshScroll();

        },

        addActivityToFav: function(e){
            var target = $(e.currentTarget);
            var activity = this.selectedActivity;
            if(!activity){
                console.warn('No Activity Selected');
                return;
            } else {
                activity.set("favorite", true);
                target.addClass('active');
            }
        },

        saveActivityToTime: function(){
            var self = this;
            var activity = this.selectedActivity;
            if(!activity){
                console.warn('No Activity Selected');
                return;
            } else {
                activity.set("recent", true);
                activity.attributes.serving = $("#serving").val() + " x " + $('#size').val();
                activity = this.multiplyServing($("#serving").val(), activity);
                this.container.container.activityItems.push(activity);
                console.log(this.container.container.activityItems);
            }
            $("span#time").text(self.time+" - ("+this.container.container.activityItems.length+")");
            this.cancelActivity();
        },

        saveAllItems: function(){
            this.container.container.subViews.busyBodyNav.saveActivitiesToJournal();
            this.container.container.setActiveView('busyBodyNav');

        },

        // When serving number changes, recalculate nutrient values
        calculateNutrients: function(){
            // var servings = $('#serving').val();
            // var att = this.model.attributes;
            // var calories      = parseFloat(att.calories) || 0;
            // var fat           = parseFloat(att.total_fat) || 0;
            // var cholesterol   = parseFloat(att.cholesterol) || 0;
            // var sodium        = parseFloat(att.sodium) || 0;
            // var carbohydrates = parseFloat(att.total_carbohydrates) || 0;
            // var fibre         = parseFloat(att.fiber) || 0;
            // var protein       = parseFloat(att.protein) || 0;

            // var el = $("#nutritionInfo");
            // el.find("#totalCalories #amount").text(calories*servings);
            // el.find("#fat #amount").text(fat*servings);
            // el.find("#cholesterol #amount").text(cholesterol*servings);
            // el.find("#sodium #amount").text(sodium*servings);
            // el.find("#carbohydrates #amount").text(carbohydrates*servings);
            // el.find("#dietryFibre #amount").text(fibre*servings);
            // el.find("#protein #amount").text(protein*servings);

            // //rda's
            // el.find("#totalCalories #rda")  .text(Math.round((calories*servings/journal.dailyValues.calories)*100) + "%");
            // el.find("#fat #rda")            .text(Math.round((fat*servings/journal.dailyValues.fat)*100) + "%");
            // el.find("#cholesterol #rda")    .text(Math.round((cholesterol*servings/journal.dailyValues.cholesterol)*100) + "%");
            // el.find("#sodium #rda")         .text(Math.round((sodium*servings/journal.dailyValues.sodium)*100) + "%");
            // el.find("#carbohydrates #rda")  .text(Math.round((carbohydrates*servings/journal.dailyValues.carbohydrates)*100) + "%");
            // el.find("#dietryFibre #rda")    .text(Math.round((fibre*servings/journal.dailyValues.fibre)*100) + "%");
            // el.find("#protein #rda")        .text(Math.round((protein*servings/journal.dailyValues.protein)*100) + "%");
            // this.updateNutrition();
        },

        updateNutrition: function(){
            var el = $("#nutritionInfo .boxEntry");

            for(var i=0; i<el.length; i++){
                var thisEl = $(el[i]);
                var percent = thisEl.find("#rda").text() || "0%";
                thisEl.find("#name").css("background-size", percent +" 100%");
            }

        },

        multiplyServing: function(serving, model){
            var att = model.attributes;
            var calories      = parseFloat(att.calories) || 0;
            var fat           = parseFloat(att.total_fat) || 0;
            var cholesterol   = parseFloat(att.cholesterol) || 0;
            var sodium        = parseFloat(att.sodium) || 0;
            var carbohydrates = parseFloat(att.total_carbohydrates) || 0;
            var fibre         = parseFloat(att.fiber) || 0;
            var protein       = parseFloat(att.protein) || 0;

            att.calories      = calories*serving;
            att.fat           = fat*serving;
            att.cholesterol   = cholesterol*serving;
            att.sodium        = sodium*serving;
            att.carbohydrates = carbohydrates*serving;
            att.fibre         = fibre*serving;
            att.protein       = protein*serving;

            model.attributes = att;
            return model;
        },

        startStopClock: function(){
            var self = this;
            var clock = this.clock;
            if(clock.isRunning()){
                console.log('stopping clock');
                clearInterval(self.timer);
                clock.stop();
            } else {
                self.timer = setInterval(function(){
                    time = clock.tick();
                    $('#stopWatch #time').html(time);
                },1000);
            }

        },

        resetClock: function(){
            this.clock.reset();
            clearInterval(this.timer);
            $('#stopWatch #time').html("00:00:00");
        }

    });
});



