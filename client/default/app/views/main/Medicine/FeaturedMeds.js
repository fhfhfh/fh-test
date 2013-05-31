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
        },

        template: _.template(tpl),
        filterTpl : _.template(filterTpl),

        initialize: function() {
            _.bindAll(this);
            this.$el.html(this.template());
        },

        render: function() {
            return this;
        },

        showFilter: function(){
            var self = this;
            var body = "<label data-id='viewMedCab' class='checked'>View in Medicine Cabinet<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
                    "<label data-id='viewMedList' class='checked'>View Medicines as a List<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
                    "<label data-id='showMed' class='checked'>Show Medication<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
                    "<label data-id='showSupplements' class='checked'>Show Supplements<img src='img/healthHub/CheckmarkOrange.png'/></label>"+
                    "<label data-id='showMedDevices' class='checked'>Show Devices<img src='img/healthHub/CheckmarkOrange.png'/></label>";
            
            if($('div #filterView').length > 0){
                $('div #filterView').toggle();
                return;
            }
            else {
                $('#featuredMeds').append(self.filterTpl({body: body})); 
            }
        },

    });
});



