/**
 * @fileOverview The Food selection screen
 * SubView of FoodScreen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/ActivityScreen/RecentFavs.html',
    'text!templates/widgets/ActivityScreen/RecentFavsRow.html',
    'collections/Activities'
], function($, _, Backbone, tpl, itemTpl, collection) {

    return Backbone.View.extend({

        tagName: 'section',
        id: 'recentFavsScreen',
        template: _.template(tpl),
        itemTpl: _.template(itemTpl),
        events: {
            'click #show-recentItems'   : 'showRecentItems',
            'click #show-myFavourites'  : 'showMyFavourites',
            'click .boxEntry'           : 'selectActivity',
            'click #saveToTime'         : 'saveActivityList'
        },

        initialize: function() {
            _.bindAll(this);

        },

        render: function() {
            var self = this;
            var list = this.populateItems();
            this.time = this.container.time;

            // Needed to ensure page renders and applies "display:block" to 
            // all boxEntry items before hide/show is called!
            setTimeout(function(){
                self.showRecentItems();
            },100);

            this.$el.html(this.template({list:list}));

            this.iscroll = new iScroll(self.$('#wrapper')[0]);
            return this;
        },

        refreshScroll: function(){
            var self = this;
            if(this.iscroll){
                this.iscroll.refresh.call(self.iscroll);
            }
        },

        populateItems: function(){
            // pull in recent and favs from foods collection
            var self = this;
            var arr1 = collection.getRecentOrFav('favorite');
            var arr2 = collection.getRecentOrFav('recent');
            var allItems = arr1.concat(arr2);
            var str = "";

            for(var i=0;i<allItems.length;i++){
                var item = allItems[i].attributes;
                str +=self.itemTpl({id:item.id, type:item.type ,activity:item.activity});
            }
            return str;
        },

        showRecentItems: function(){
            this.$('li').removeClass('selected');
            this.$('#show-recentItems').addClass('selected');
            this.$('.boxEntry[data-type="favorite"]').hide();
            this.$('.boxEntry[data-type="recent"]').show();
            this.refreshScroll();
        },

        showMyFavourites: function(){
            this.$('li').removeClass('selected');
            this.$('#show-myFavourites').addClass('selected');
            this.$('.boxEntry[data-type="recent"]').hide();
            this.$('.boxEntry[data-type="favorite"]').show();
            this.refreshScroll();
        },

        selectActivity: function(e){
            var target = $(e.currentTarget);
            var id = target.attr('data-id');
            var model = collection.get(id);
            var attr = model.attributes;
            this.selectedActivity = model;
            target.find('img').toggle();
            target.toggleClass('selected');

            //TODO: populate notes, and add selected food to array, ready to save to time

            $('#minutes').val(1);
            $('#calBurned').val(attr.calorieBaseline);
            $('#notes').val(attr.notes);
        },

        saveActivityList: function(){
            var self = this;
            console.log('saving activity...');
            var list = $('.boxEntry.selected');

            for(var i=0;i<list.length;i++){
                var id = $(list[i]).attr('data-id');
                var model = collection.get(id);

                model.set("recent", true);
                model.attributes.calorieBaseline = $("#minutes").val() + " x " + $('#calBurned').val();
                model = this.multiplyServing($("#minutes").val(), model);

                this.container.container.activityItems.push(model);
            }

            $("span#time").text(self.time+" - ("+this.container.container.activityItems.length+")");
        },

        multiplyServing: function(minutes, model){
            var att = model.attributes;
            var calories      = parseFloat(att.calories) || 0;

            att.calories      = calories*minutes;
            model.attributes = att;
            return model;
        }

    });
});



