/*--------------------
	app/views/main/library/Research

--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'text!templates/components/Omnipedial.html',
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
    'text!templates/components/AngioStep2.html',
    ], function($, _, Backbone, omnipidiaTpl,tpl,omniDetailsTpl,informationTpl,infoDetailsTpl,
        interactionsTpl,sympTpl,showMeTpl,showMeDetailsTpl,showSymptomListTpl,sympDetailsTpl,riskFactorTpl,genRiskTpl,lifestyleTpl,riskFactorDeatilsTpl,riskFactQuesTpl,completeAssessTpl,
        toolsTpl,bodyMassTpl,caloriesTpl,heartTpl,weightTpl,nutritionTpl,waistTpl,assistantTpl,
        surgriesTpl,testsTpl,MedsTpl,angiogarphyTpl,angioStep1Tpl,angioStep2Tpl) {


        return Backbone.View.extend({

            // Backbone specific attributes
            tagName		: 'section',
            id			: 'research',
            events		: {
                'click #menu1, #omnibtn1' : 'showOmnipidia',
                'click #menu2, #omnibtn2' : 'showInformation',
                'click #menu3, #omnibtn3' : 'showInteractions',
                'click #menu4, #omnibtn4' : 'showSymp',
                'click #menu5, #omnibtn5' : 'showRiskFactor',
                'click #menu6, #omnibtn6,#showTests'  : 'showAssistant',
                'click #menu8, #omnibtn8' : 'showTools',
                'click #showOmnipedia' : 'showOmnipidia',
                'click #quitBtn' : 'render',
                'click #omniListArea #omniDetails .boxEntry' : 'showOmnipidiaDetails',
                'click #infoListArea #infoDetails .boxEntry' : 'showInformationDetails',
                'click #showInformation' : 'showInformation',
                'click #showRiskFactor' : 'showRiskFactor',
                'click #infoBtn, #omnibtn, .research-menuBtn':'showMenu',
                'click #interaction-myMedia':'showMyMedia',
                'click #interaction-search':'showSearch',
                'click #sympShowMe':'showShowMe',
                'click #sympList':'showSympList',
                'click .sympDark, .sympLight' :'showMeDetails',
                'click #riskFactor-general':'showGenRisk',
                'click #riskFactor-lifestyle':'showlifestyle',
                'click .conditionBtn':'showRiskFactorDetails',
                'click #showRiskFactorDetails':'showRiskFactorDetails',
                'click #startImg':'showriskFactQues',
                'click #prevImg':'showRiskFactorDetails',
                'click #nextImg':'showRiskFactorCompleteAssessment',
                'click #showriskFactQues':'showriskFactQues',
                'click #moreDetails':'showPopup',
                'click #researchCloseBtn':'closePopup',
                'click #bodyMass':'showBodyMass',
                'click #calories':'showCalories',
                'click #heartRate':'showHeartRate',
                'click #weight':'showWeight',
                'click #nutrition-tab':'showNutrition',
                'click #waist':'showWaist',
                'click #surgeries':'showSurgeries',
                'click #tests-tab ':'showTests',
                'click #medications':'showMeds',
                'click #angiography, #angio-prevImg, #showAngiography':'showAngiography',
                'click #angio-startBtn, #showAngioStep1, #angio-step2-prevImg':'showAngioStep1',
                'click #angio-nextImg':'showAngioStep2',
                'click #angioMoreDetails':'showAngioPopup',
                'click #symp-Details .boxEntry':'showSympDetails'
                
                
 
            },
            template	: _.template(tpl),


            initialize : function(){
                _.bindAll(this);
            },

            render: function(){
                var self = this;

                this.$el.html(this.template());
//                this.bodyScroll = new iScroll(this.$('#research-desk')[0],{
//                    bounceLock	: true,
//                    bounce 		: true,
//                    vScrollbar 	: true
//                });
//                this.refreshScroll();
                return this;
            },
            
            showOmnipidia: function(e){
                var details = _.template(omnipidiaTpl);
                this.$el.html(details);
                this.loadListOmni();
            },
            
            showInformation: function(e){
                var details = _.template(informationTpl);
                this.$el.html(details);
                this.loadListInfo();
            },
            
            showInteractions: function(e){
                var details = _.template(interactionsTpl);
                this.$el.html(details);
                this.showMyMedia();
            },
            
            showRiskFactor: function(e){
                var details = _.template(riskFactorTpl);
                this.$el.html(details);
                this.showGenRisk();
            },
            
            showSymp: function(e){
                var details = _.template(sympTpl);
                this.$el.html(details);
                this.showShowMe();
            },
            
            showTools: function(e){
                var details = _.template(toolsTpl);
                this.$el.html(details);
                this.showBodyMass();
            },
            showAssistant: function(e){
                var details = _.template(assistantTpl);
                this.$el.html(details);
                this.showSurgeries();
            },
           
            showSearch: function(e){
                this.$('li').removeClass('selected');
                this.$('#interaction-search').addClass('selected');
                this.$('#inter-myMedia').attr("style","visibility:hidden");
                this.$('#inter-search').attr("style","visibility:visible");
            },
            
            showMyMedia: function(e){
                this.$('li').removeClass('selected');
                this.$('#interaction-myMedia').addClass('selected');
                this.$('#inter-myMedia').attr("style","visibility:visible");
                this.$('#inter-search').attr("style","visibility:hidden");
            },
            showGenRisk: function(e){
                this.$('li').removeClass('selected');
                this.$('#riskFactor-general').addClass('selected');
                var details = _.template(genRiskTpl);
                this.$('#risk-tab-area').html(details);
            },
            
            showlifestyle: function(e){
                this.$('li').removeClass('selected');
                this.$('#riskFactor-lifestyle').addClass('selected');
                var details = _.template(lifestyleTpl);
                this.$('#risk-tab-area').html(details);
            },
            
            showInformationDetails: function(e){
                var details = _.template(infoDetailsTpl);
                this.$el.html(details);
            },
                
                
            showOmnipidiaDetails: function(e){
                var details = _.template(omniDetailsTpl);
                this.$el.html(details);
            },
            
            showRiskFactorDetails: function(e){
                var details = _.template(riskFactorDeatilsTpl);
                this.$el.html(details);
            },
            showriskFactQues: function(e){
                var details = _.template(riskFactQuesTpl);
                this.$el.html(details);
            },
            
            showAngiography: function(e){
                var details = _.template(angiogarphyTpl);
                this.$el.html(details);
                this.closeAngioPopup();
            },
            
            showAngioStep1: function(e){
                var details = _.template(angioStep1Tpl);
                this.$el.html(details);
            },
              
            showAngioStep2: function(e){
                var details = _.template(angioStep2Tpl);
                this.$el.html(details);
            },
            
            showRiskFactorCompleteAssessment: function(e){
                var details = _.template(completeAssessTpl);
                this.$el.html(details);
                this.closePopup();
            },
            
            showPopup : function(){
                $('#modalMask1').show();
                this.$('#popupDeatils').attr("style","display:block");
                this.iscroll.refresh();
            },
            
            closePopup: function(){
                $('#modalMask1').hide();
                this.$('#popupDeatils').attr("style","display:none");
                this.iscroll.refresh();
            },
            showAngioPopup : function(){
                $('#modalMask1').show();
                this.$('#popupDeatils').attr("style","display:block");
                this.iscroll.refresh();
            },
            
            closeAngioPopup: function(){
                $('#modalMask1').hide();
                this.$('#popupDeatils').attr("style","display:none");
                this.iscroll.refresh();
            },
            
            showShowMe: function(e){
                this.$('li').removeClass('selected');
                this.$('#sympShowMe').addClass('selected');
                var details = _.template(showMeTpl);
                this.$('#symp-tab-area').html(details);
            },
            
            showSympList: function(e){
                this.$('li').removeClass('selected');
                this.$('#sympList').addClass('selected');
                var details = _.template(showSymptomListTpl);
                this.$('#symp-tab-area').html(details);
                this.loadListSymp();
            },
            
            showSympDetails: function(e){
                this.$('li').removeClass('selected');
                this.$('#sympList').addClass('selected');
                var details = _.template(sympDetailsTpl);
                this.$('#symp-tab-area').html(details);
            },
            
            showMeDetails: function(e){
                this.$('li').removeClass('selected');
                this.$('#sympShowMe').addClass('selected');
                var details = _.template(showMeDetailsTpl);
                this.$('#symp-tab-area').html(details);
               
            },
            
            showSurgeries: function(e){
                this.$('li').removeClass('selected');
                this.$('#surgeries').addClass('selected');
                var details = _.template(surgriesTpl);
                this.$('#assistant-tab-area').html(details);
                
            },
            
            showTests: function(e){
                this.$('li').removeClass('selected');
                this.$('#tests-tab').addClass('selected');
                var details = _.template(testsTpl);
                this.$('#assistant-tab-area').html(details);
                
            },
            showMeds: function(e){
                this.$('li').removeClass('selected');
                this.$('#medications').addClass('selected');
                var details = _.template(MedsTpl);
                this.$('#assistant-tab-area').html(details);
                
            },
            
            showBodyMass: function(e){
                this.$('li').removeClass('selected');
                this.$('#bodyMass').addClass('selected');
                var details = _.template(bodyMassTpl);
                this.$('#tools-tab-area').html(details);
            },
            
            showCalories: function(e){
                this.$('li').removeClass('selected');
                this.$('#calories').addClass('selected');
                var details = _.template(caloriesTpl);
                this.$('#tools-tab-area').html(details);
            },
            
            showHeartRate: function(e){
                this.$('li').removeClass('selected');
                this.$('#heartRate').addClass('selected');
                var details = _.template(heartTpl);
                this.$('#tools-tab-area').html(details);
            },
            
            showWeight: function(e){
                this.$('li').removeClass('selected');
                this.$('#weight').addClass('selected');
                var details = _.template(weightTpl);
                this.$('#tools-tab-area').html(details);
            },
            
            showNutrition: function(e){
                this.$('li').removeClass('selected');
                this.$('#nutrition-tab').addClass('selected');
                var details = _.template(nutritionTpl);
                this.$('#tools-tab-area').html(details);
            },
            
            showWaist: function(e){
                this.$('li').removeClass('selected');
                this.$('#waist').addClass('selected');
                var details = _.template(waistTpl);
                this.$('#tools-tab-area').html(details);
            },
            
            loadListOmni : function(){
                var flag = 0;
                var name = new Array("A-fib","AAA","Aarskog syndrome","B-fib","BBB","C-fib");
                name.sort();
                for(var i=0;i<name.length;i++){
                    
                    var temp = name[i];
                    if(i==0){
                    {
                        $('#omniDetails').append("<div id='omniListHead'>"+temp.charAt(0)+"</div>");
                    }
                    }
                    if(!i==0)
                        if(temp.charAt(0)!=name[i-1].charAt(0))
                        {
                            $('#omniDetails').append("<div id='omniListHead'>"+temp.charAt(0)+"</div>");
                        }
                    if(flag == 1){
                        var html = "<div class='boxEntry' style='background-color:#ebebeb' id='"+temp+"''><span id='name'> "+temp+"</span>"+
                        "<span id='about'>" + "</span></div>";
                        $('#omniDetails').append(html);
                        flag=0;
                    }
                    else
                    {
                        var html = "<div class='boxEntry'  id='"+temp+"''><span id='name'> "+temp+"</span>"+
                        "<span id='about'>" + "</span></div>";
                        $('#omniDetails').append(html);
                        flag=1;
                    }
                        
                }
            },
            
            loadListInfo : function(){
                var flag = 0;
                var name = new Array("A-fib","AAA","Aarskog syndrome","B-fib","BBB","C-fib");
                name.sort();
                for(var i=0;i<name.length;i++){
                    
                    var temp = name[i];
                    if(i==0){
                    {
                        $('#infoDetails').append("<div id='infoListHead'>"+temp.charAt(0)+"</div>");
                    }
                    }
                    if(!i==0)
                        if(temp.charAt(0)!=name[i-1].charAt(0))
                        {
                            $('#infoDetails').append("<div id='infoListHead'>"+temp.charAt(0)+"</div>");
                        }
                    if(flag == 1){
                        var html = "<div class='boxEntry' style='background-color:#ebebeb' id='"+temp+"''><span id='name'> "+temp+"</span>"+
                        "<span id='about'>" + "</span></div>";
                        $('#infoDetails').append(html);
                        flag=0;
                    }
                    else
                    {
                        var html = "<div class='boxEntry'  id='"+temp+"''><span id='name'> "+temp+"</span>"+
                        "<span id='about'>" + "</span></div>";
                        $('#infoDetails').append(html);
                        flag=1;
                    }
                        
                }
            },
            
            loadListSymp : function(){
                var flag = 0;
                var name = new Array("Abdominal bloating","Abdomen - swollen","Aarskog syndrome","Abdominal cramps in children","Abdominal fullness prematurely after meals Abdominal mass","BBB","C-fib");
                name.sort();
                for(var i=0;i<name.length;i++){
                    
                    var temp = name[i];
                    if(i==0){
                    {
                        $('#symp-Details').append("<div id='symp-Head'>"+temp.charAt(0)+"</div>");
                    }
                    }
                    if(!i==0)
                        if(temp.charAt(0)!=name[i-1].charAt(0))
                        {
                            $('#symp-Details').append("<div id='symp-Head'>"+temp.charAt(0)+"</div>");
                        }
                    if(flag == 1){
                        var html = "<div class='boxEntry' style='background-color:#ebebeb' id='"+temp+"''><span id='name'> "+temp+"</span>"+
                        "<span id='about'>" + "</span></div>";
                        $('#symp-Details').append(html);
                        flag=0;
                    }
                    else
                    {
                        var html = "<div class='boxEntry'  id='"+temp+"''><span id='name'> "+temp+"</span>"+
                        "<span id='about'>" + "</span></div>";
                        $('#symp-Details').append(html);
                        flag=1;
                    }
                        
                }
            },
            
            showMenu : function(){
                $("#research-menu").attr("style","visibility:visible")
            }

        });
    });
