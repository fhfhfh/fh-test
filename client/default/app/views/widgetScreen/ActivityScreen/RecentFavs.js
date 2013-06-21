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
    'collections/Foods'
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
            'click #saveToMeal'         : 'saveActivityList'
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
                str +=self.itemTpl({id:item.id, type:item.type ,name:item.name});
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
            this.selectActivity = model;
            target.find('img').toggle();
            target.toggleClass('selected');

            //TODO: populate notes, and add selected food to array, ready to save to time

            $('#serving').val(1);
            $('#size').val(attr.serving[0].name);
            $('#notes').val(attr.notes);
        },

        saveActivityList: function(){
            var self = this;
            console.log('saving activity...');
            var list = $('.boxEntry.selected');
            console.log(list);
            for(var i=0;i<list.length;i++){
                var id = $(list[i]).attr('data-id');
                var model = collection.get(id);

                model.set("recent", true);
                model.attributes.serving = $("#serving").val() + " x " + $('#size').val();
                model = this.multiplyServing($("#serving").val(), model);
                console.log(model);
                this.container.container.activityItems.push(model);
            }

            $("span#time").text(self.time+" - ("+this.container.container.activityItems.length+")");
        },

        multiplyServing: function(serving, model){
            // var att = model.attributes;
            // var calories      = parseFloat(att.calories) || 0;
            // var fat           = parseFloat(att.total_fat) || 0;
            // var cholesterol   = parseFloat(att.cholesterol) || 0;
            // var sodium        = parseFloat(att.sodium) || 0;
            // var carbohydrates = parseFloat(att.total_carbohydrates) || 0;
            // var fibre         = parseFloat(att.fiber) || 0;
            // var protein       = parseFloat(att.protein) || 0;

            // att.calories      = calories*serving;
            // att.fat           = fat*serving;
            // att.cholesterol   = cholesterol*serving;
            // att.sodium        = sodium*serving;
            // att.carbohydrates = carbohydrates*serving;
            // att.fibre         = fibre*serving;
            // att.protein       = protein*serving;

            // model.attributes = att;
            // return model;
        }

    });
});



