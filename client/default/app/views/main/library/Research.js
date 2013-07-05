/*--------------------
	app/views/main/library/Research

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Omnipedia.html',
        'text!templates/components/Research.html',
        'text!templates/components/Information.html',
        'text!templates/components/Interactions.html',
        'text!templates/components/Symptom.html',
        'text!templates/components/RiskFactor.html',
        'text!templates/components/CareGuide.html',
        'text!templates/components/Tools.html',
        'text!templates/components/Assistant.html'
], function($, _, Backbone, omnipediaTpl, tpl, informationTpl, interactionsTpl, sympTpl, riskFactorTpl,
    careTpl, toolsTpl, assistantTpl) {


    return Backbone.View.extend({

        // Backbone specific attributes
        tagName: 'section',
        id: 'research',
        events: {
            'click #menu1, #omnibtn1': 'showOmnipedia',
            'click #menu2, #omnibtn2': 'showInformation',
            'click #menu3, #omnibtn3': 'showInteractions',
            'click #menu4, #omnibtn4': 'showSymptomNavigator',
            'click #menu5, #omnibtn5': 'showRiskFactor',
            'click #menu6, #omnibtn6': 'showAssistant',
            'click #menu7, #omnibtn7': 'showCareGuide',
            'click #menu8, #omnibtn8': 'showTools',
            'click #showOmnipedia': 'showOmnipedia',
            'click .topBtn, .omniBtn': 'showMenu'
        },
        template: _.template(tpl),

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            var self = this;

            this.$el.html(this.template());
            this.$content = this.$('#researchInnerDivMenu');
            // this.resScroll = new iScroll(this.$('#research-desk')[0],{
            //     bounceLock	: true,
            //     bounce		: true,
            //     vScrollbar	: true
            // });
            // this.refreshScroll();

            return this;
        },

        showOmnipedia: function(e) {
            var details = _.template(omnipediaTpl);
            this.$content.html(details);
            $.ajax({
                url: "http://securehealthhub.adam.com/content.aspx?productId=117",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Referer", 'peachy');
                },
                success: function() {
                    $("iframe").attr("src", 'http://securehealthhub.adam.com/content.aspx?productId=117');
                }
            });
            // this.container.refreshScroll();
        },

        showInformation: function(e) {
            var details = _.template(informationTpl);
            this.$content.html(details);
            // this.container.refreshScroll();
        },

        showInteractions: function(e) {
            var details = _.template(interactionsTpl);
            this.$content.html(details);
            // this.container.refreshScroll();
        },

        showRiskFactor: function(e) {
            var details = _.template(riskFactorTpl);
            this.$content.html(details);
            // this.container.refreshScroll();
        },

        showCareGuide: function() {
            var details = _.template(careTpl);
            this.$content.html(details);
            // this.container.refreshScroll();
        },

        showSymptomNavigator: function(e) {
            var details = _.template(sympTpl);
            this.$content.html(details);
            // this.container.refreshScroll();
        },

        showTools: function(e) {
            var details = _.template(toolsTpl);
            this.$content.html(details);
            // this.container.refreshScroll();
        },
        showAssistant: function(e) {
            var details = _.template(assistantTpl);
            this.$content.html(details);
            // this.container.refreshScroll();
        },

        showMenu: function() {
            $("#research-menu").toggle();
        }

    });
});