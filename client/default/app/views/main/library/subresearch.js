/*--------------------
    app/views/main/library/Research

--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'text!templates/components/Omnipedia.html',
    'text!templates/components/Research.html',
    'text!templates/components/OmnipediaDetails.html',
    'text!templates/components/Information.html',
    'text!templates/components/InformationDetails.html',
    'text!templates/components/Interactions.html',
    'text!templates/components/Symptom.html',
    'text!templates/components/ShowMe.html',
    'text!templates/components/ShowMeDetails.html',
    'text!templates/components/SymptomList.html',
    'text!templates/components/SympDetails.html',
    'text!templates/components/RiskFactor.html',
    'text!templates/components/General-risk.html',
    'text!templates/components/Lifestyle.html',
    'text!templates/components/RiskFactorNaviDetails.html',
    'text!templates/components/RiskFactorQuestion.html',
    'text!templates/components/RiskFactorCompleteAssessment.html',
    'text!templates/components/Tools.html',
    'text!templates/components/BodyMass.html',
    'text!templates/components/Calories.html',
    'text!templates/components/Heart.html',
    'text!templates/components/Weight.html',
    'text!templates/components/Nutrition.html',
    'text!templates/components/Waist.html',
    'text!templates/components/Assistant.html',
    'text!templates/components/AssistantSurgries.html',
    'text!templates/components/AssistantTests.html',
    'text!templates/components/AssistantMeds.html',
    'text!templates/components/Angiography.html',
    'text!templates/components/AngioStep1.html',
    'text!templates/components/AngioStep2.html'
    ], function($, _, Backbone, omnipidiaTpl,tpl,omniDetailsTpl,informationTpl,infoDetailsTpl,
        interactionsTpl,sympTpl,showMeTpl,showMeDetailsTpl,showSymptomListTpl,sympDetailsTpl,riskFactorTpl,genRiskTpl,lifestyleTpl,riskFactorDeatilsTpl,riskFactQuesTpl,completeAssessTpl,
        toolsTpl,bodyMassTpl,caloriesTpl,heartTpl,weightTpl,nutritionTpl,waistTpl,assistantTpl,
        surgriesTpl,testsTpl,MedsTpl,angiogarphyTpl,angioStep1Tpl,angioStep2Tpl) {


        return Backbone.View.extend({

            // Backbone specific attributes
            tagName     : 'section',
            id          : 'research',
            events      : {
                'click #menu1, #omnibtn1'           : 'showOmnipidia',
                'click #menu2, #omnibtn2'           : 'showInformation',
                'click #menu3, #omnibtn3'           : 'showInteractions',
                'click #menu4, #omnibtn4'           : 'showSymp',
                'click #menu5, #omnibtn5'           : 'showRiskFactor',
                'click #menu6, #omnibtn6,#showTests': 'showAssistant',
                'click #menu8, #omnibtn8'           : 'showTools',
                'click #showOmnipedia'              : 'showOmnipidia'
            },
            template    : _.template(tpl),

            subViews: {

            },


            initialize : function(){
                _.bindAll(this);
            },

            render: function(num){
                var self = this;

                this.$el.html('');
                this.resScroll = new iScroll(this.$('#research-desk')[0],{
                    bounceLock  : true,
                    bounce      : true,
                    vScrollbar  : true
                });
                this.refreshScroll();
                this.picScreen(num);
                return this;
            },

            picScreen: function(num){
                var me=this;
                switch(num){
                    case 1:
                        me.showOmnipedia();
                        break;
                    case 2:
                        me.showInformation();
                        break;
                    case 3:
                        me.showInteractions();
                        break;
                    case 4:
                        me.showSypmtomNavigator();
                        break;
                    case 5:
                        me.showRiskFactor();
                        break;
                    case 6:
                        me.showDecisionAssistant();
                        break;
                    case 7:
                        me.showCareGuides();
                        break;
                    case 8:
                        me.showWellnessTools();
                        break;
                    default:
                        alert('Invalid Screen');
                }
            },

            showOmnipedia: function(e){
                var details = _.template(omnipidiaTpl);
                this.$el.html(details);
                this.resScroll.refresh();
            },

            showInformation: function(e){
                var details = _.template(informationTpl);
                this.$el.html(details);
                this.resScroll.refresh();
            },

            showInteractions: function(e){
                var details = _.template(interactionsTpl);
                this.$el.html(details);
                this.resScroll.refresh();
            },

            showRiskFactor: function(e){
                var details = _.template(riskFactorTpl);
                this.$el.html(details);
                this.resScroll.refresh();
            },

            showSymptomNavigator: function(e){
                var details = _.template(sympTpl);
                this.$el.html(details);
                this.resScroll.refresh();
            },

            showCareGuides: function(){
                var details = _.template(toolsTpl);
                this.$el.html(details);
                this.resScroll.refresh();
            },

            showWellnessTools: function(e){
                var details = _.template(toolsTpl);
                this.$el.html(details);
                this.resScroll.refresh();
            },
            showDecisionAssistant: function(e){
                var details = _.template(assistantTpl);
                this.$el.html(details);
                this.resScroll.refresh();
            }

        });
    });
