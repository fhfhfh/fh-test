/**
 * @fileOverview The Food selection screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/FoodScreen.html',
    'text!templates/widgets/FoodItem.html',
    'collections/Foods'
], function($, _, Backbone, tpl, foodItem, collection) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'foodScreen',
        collection: collection,
        template: _.template(tpl),
        itemTpl: _.template(foodItem),
        events: {
            'click .foodItem' : 'selectFood',
            'click #foodList .boxEntry' : 'showFoodItemScreen',
            'click #cancelBtn': 'cancelFoodEntry',
            'click #backToTop': 'backToTop',
            'click .item'     : 'selectItem'
        },

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            this.$el.html(this.template());

            this.level1Scroll = new iScroll(this.$('#level1Food')[0],{
                hScroll     : true,
                vScroll     : false,
                hScrollbar  : false,
                bounceLock  : true,
                bounce      : false
            });

            this.pageScroll = new iScroll(this.$('#content')[0]);
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
        selectFood: function(e){
            var self = this;
            var target = $(e.currentTarget);

            if(target.hasClass('lv1')){
                if($(".foodItem.lv1.selected").length > 0){
                    $('.foodItem.lv1.selected img').attr('src', $('.foodItem.lv1.selected img').attr('src').replace("icon-over", "icon"));
                    $('.foodItem.lv1').removeClass('selected');
                }
                
                target.find('img').attr('src', target.find('img').attr('src').replace("icon.", "icon-over."));
                var name = target.attr('data-id');

                $('.foods2').hide();
                $('.foods2.'+name).show();
                $('#foodList').hide();
            }
            else if(target.hasClass('lv2')){
                $('.foodItem.lv2').removeClass('selected');
                $('#foodList').show();
            }
            
            target.addClass('selected');

            // if both level categories are selected, show foodList
            if($('.foodItem.lv1').hasClass('selected') && $('.foodItem.lv2:visible').hasClass('selected')){
                $('#foodList').show();
                self.populateFoodList(target);
            }
            this.refreshScroll();
        },

        showFoodItemScreen: function(e){
            console.log('11');
            var self = this;
            var target = $(e.currentTarget);
            var imgSrc = $(".lv2.selected img").attr("src");
            var id = target.attr('data-id');
            if(id){
                var model = this.collection.get(id);
                self.oldHtml = this.$("#content").html();
                this.$("#content").html(self.itemTpl({item:model.attributes, imgSrc:imgSrc}));
            } else {
                console.log('out');
                this.$("#content").html(self.oldHtml);
            }
            self.refreshScroll();
        },

        cancelFoodEntry: function(e){
            this.container.setActiveView('foodometerNav');
        },

        populateFoodList: function(el){
            var self = this;
            var target = $(el);
            var name = target.attr('data-name');
            console.log(name);
            $('#foodList').html('');

            // pull foods into collection before populating screen
            this.collection.getFoods(name, function(res){
                console.log(res[0]);
                for(var i=0;i<res.length;i++){
                    var item = res[i];
                    var name = item.name || item.attributes.name;
                    var html = "<div class='boxEntry' data-id='"+item.id+"''><span id='name'>" +name +"</span>"+
                                "<span id='about'>" + "</span></div>";
                    $('#foodList').append(html);
                }
                self.refreshScroll();
            });
        },

        backToTop: function(){
            this.pageScroll.scrollTo(0,0,200);
        },

        selectItem: function(e){
            var target = $(e.currentTarget);
            target.toggleClass('selected');
        }

    });
});



