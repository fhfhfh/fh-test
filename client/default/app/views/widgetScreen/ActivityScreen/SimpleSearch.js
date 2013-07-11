/**
 * @fileOverview The Food search Screen
 * SubView of FoodScreen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/ActivityScreen/SimpleSearch.html',
    'text!templates/widgets/ActivityItem.html',
    'collections/Activities',
    'collections/ActivityJournal'
], function($, _, Backbone, tpl, activityItem, activities, journal) {
    return Backbone.View.extend({
        tagName : 'section',
        id      : 'simpleSearchScreen',
        template: _.template(tpl),
        itemTpl : _.template(activityItem),
        events  : {
            "click #searchImg"             : "searchActivity",
            "click #xImg"                  : "clearSearchField",
            "click #backToTop"             : "backToTop",
            "click #activityList .boxEntry": "showActivityItemScreen",
            'click #cancelActivity'        : 'cancelActivity',
            'click #activityFavBtn'        : 'addActivityToFav',
            'click #saveToTime'            : 'saveActivityToTime',
            'change #minutes'              : 'calculateNutrients',
            'submit #searchForm'           : "searchActivity"
        },

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            var self = this;
            this.time = this.container.time;

            this.$el.html(this.template());
            $('#filterButtons').show();
            this.listScroll = new iScroll(this.$('#scrollContainer')[0]);
            $("span#time").text(self.time+" - ("+this.container.container.activityItems.length+")");

            return this;
        },

        refreshScroll: function(){
            var self = this;
            setTimeout(function(){
                self.listScroll.refresh();
            }, 100);
        },

        searchActivity: function(){
            var self = this;
            var searchTerm = $("#searchTerm").val().toLowerCase();
            var type = $("#filter").find(":selected").val();

            if(searchTerm === null || searchTerm === ""){
                Backbone.trigger('notify', 'Please enter a search term', 'Search Error');
                return;
            }

            $('#activityList').html('');
            $('#modalMask').show().append("<img src='img/spinner.gif'/>");

            activities.singleSearch(searchTerm, type, function(err,data){
                if(err){
                    Backbone.trigger('notify', err, 'Error getting Activity List');
                    $('#modalMask').hide().html("");
                    return;
                }
                if(data.length === 0){
                    $('#activityList').append("<h1>No Activities Found</h1>");
                }
                $('#activityList').show();
                for(var i=0;i<data.length;i++){
                    var item = data[i];
                    var name = item.activity || item.attributes.activity;
                    var html = "<div class='boxEntry' data-id='"+item.id+"''><span id='name'>" +name +"</span>"+
                                "<span id='about'>" + "</span></div>";
                    $('#activityList').append(html);
                }
                self.container.container.iscroll.disable();
                $('#modalMask').hide().html("");
                $('#backToTop').show();
                self.refreshScroll();
            });
            return false;
        },

        clearSearchField: function(){
            $("#searchTerm").val("");
        },

        backToTop: function(){
            this.listScroll.scrollTo(0,0,200);
        },

        showActivityItemScreen: function(e){
            console.log('Selected');
            var self = this;
            var target = $(e.currentTarget);
            var id = target.attr('data-id');
            var model = activities.get(id);
            this.model = model;
            this.selectedActivity = model;

            this.oldHtml = this.$el.html();
            $('#filterButtons').hide();
            this.$el.html(self.itemTpl({item:model.attributes, imgSrc:""}));

            this.calculateNutrients();
            this.refreshScroll();
            this.listScroll = null;
        },

        cancelActivity: function(){
            this.model = null;
            this.selectedActivity = null;
            this.$el.html(this.oldHtml);
            $('#filterButtons').show();
            this.listScroll = new iScroll(this.$('#scrollContainer')[0]);

            this.refreshScroll();

        },

        addActivityToFav: function(){
            var activity = this.selectedActivity;
            if(!activity){
                console.warn('No Food Selected');
                return;
            } else {
                activity.set("favorite", true);
            }
        },

        saveActivityToTime: function(){
            var self = this;
            var activity = this.selectedActivity;
            if(!activity){
                console.warn('No Activity Selected');
                return;
            } else {
                var mins = parseInt($("#minutes").val());
                var cals = parseFloat($('#calBurned').val());
                console.log('mins',mins,cals);
                activity.set("recent", true);
                activity.set('calories', mins*cals);
                activity.set('minutes', mins);
                this.container.container.activityItems.push(activity);
            }
            $("span#time").text(self.time+" - ("+this.container.container.activityItems.length+")");
            this.cancelActivity();
        },

        // When minutes number changes, recalculate calories
        calculateNutrients: function(){
            var minutes = $('#minutes').val();
            var att = this.model.attributes;
            var calories      = parseFloat(att.calorieBaseline) || 0;

            var el = $("#nutritionInfo");
            el.find("#totalCalories #amount").text(calories*minutes);
            this.updateNutrition();
        },

        updateNutrition: function(){
            var el = $("#nutritionInfo .boxEntry");

            for(var i=0; i<el.length; i++){
                var thisEl = $(el[i]);
                var percent = thisEl.find("#rda").text() || "0%";
                thisEl.find("#name").css("background-size", percent +" 100%");
            }
        }

    });
});



