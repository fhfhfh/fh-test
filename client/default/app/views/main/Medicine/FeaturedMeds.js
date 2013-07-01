/**
 * @fileOverview Featured Medicines Screen
 * SubView of Medicine
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/popups/FilterView.html',
    'text!templates/components/FeaturedMeds.html'
], function($, _, Backbone, filterTpl, tpl) {
    return Backbone.View.extend({
        tagName: 'section',
        id: 'featuredMedsScreen',

        events  : {
            'click #viewOpt' : 'showFilter',
            'click label' : 'checkItem'
        },

        template: _.template(tpl),
        filterTpl : _.template(filterTpl),

        initialize: function() {
            _.bindAll(this);
            this.$el.html(this.template());
        },

        render: function() {
            this.activeView = "shelf";
            return this;
        },

        showFilter: function(){
            var self = this;
            var body =
                    "<label data-id='viewMedList' data-type='1' class=''>View Medicines as a List<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
                    "<label data-id='showMed' data-type='medication' class='checked'>Show Medication<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
                    "<label data-id='showSupplements' data-type='supplement' class='checked'>Show Supplements<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
                    "<label data-id='showMedDevices' data-type='device' class='checked'>Show Devices<img src='img/healthHub/CheckmarkOrange.png'/></label>";

            if($('div #filterView').length > 0){
                $('div #filterView').toggle();
                return;
            }
            else {
                $('#featuredMeds').append(self.filterTpl({body: body}));
            }
        },

        checkItem: function(e){
            var self = this;
            var target = $(e.currentTarget);
            var type = target.attr("data-type");

            target.toggleClass('checked');

            if(type != 1){
                // toggle individual medicine types
                $('.' + type).toggle();
            } else {
                // toggle between shelf and list views
                if(self.activeView == "shelf"){
                    self.activeView = "list";
                    $('#medCabinet').hide();
                    $('#listView').show();
                }
                else {
                    self.activeView = "shelf";
                    $('#medCabinet').show();
                    // this.bodyScroll.refresh();
                    $('#listView').hide();
                }
            }
        }
    });
});



