define([
    'jquery',
    'underscore',
    'backbone',
    'views/ContainerView',
    'views/main/healthHub/History',
    'views/main/healthHub/Data',
    'views/main/healthHub/Conditions',
    'text!templates/pages/HealthHub.html',
    'controllers/HealthHub',
    ], function($, _, Backbone, ContainerView, HistoryView, DataView, ConditionsView, template,controller) {
        var resp = "";
        return ContainerView.extend({
            tagName	: 'section',
            id		: 'healthHub',
            //            resp        : "",

            events : {
                'click #show-history'		: 'showHistory',
                'click #show-data'			: 'showData',
                'click #show-conditions'	: 'showConditions'
            },

            subViews: {
                history	: new HistoryView(),
                data		: new DataView(),
                conditions: new ConditionsView()
            },

            initialize: function(options) {
                var self = this;
                _.bindAll(this);
                
                this.$el.html(template);
                this.$content = this.$('#healthHub-content');

                this.iscroll = new iScroll(this.$('#wrapper')[0], {
                    hscroll: false,
                    fixedScrollbar: true,
                    bounce: false,
                    vScrollbar: false
                });
            },

            render: function() {
                
                var self = this;
                this.setActiveView('data');
                this.delegateEvents();
                if (this.activeView) {
                    this.activeView.delegateEvents();
                // this.setActiveView(self.activeView);
                }
                setValue();
                this.$('li').removeClass('selected');
                this.$('#show-data').addClass('selected');
                this.refreshScroll();
                return this;
            },

            refreshScroll: function(){
                var self = this;
                if(this.iscroll){
                    this.iscroll.refresh.call(self.iscroll);        
                }
            },

            showHistory : function(){
                this.$('li').removeClass('selected');
                this.$('#show-history').addClass('selected');
                this.setActiveView('history');
                for(var i=0; i<resp.payload.familyHistories.length; i++)
                    $('div #history #familyHistory #body').append('<div id="row"><span class="name">'+resp.payload.familyHistories[i].familyMember+'</span><span class="value">'+resp.payload.familyHistories[i].diagnosis+'</span></div>');
                for(var i=0; i<resp.payload.socialHistories.length; i++)
                    $('div #history #socialHistory #body').append('<div id="row"><span class="name">'+resp.payload.socialHistories[i].socialHistoryElement+'</span><span class="value">'+resp.payload.socialHistories[i].description+'</span></div>');
                this.refreshScroll();
            },

            showData : function(){
                this.$('li').removeClass('selected');
                this.$('#show-data').addClass('selected');
                this.setActiveView('data');
                for(var i=0; i<resp.payload.vitalSigns.length; i++)
                         {  
                             $('div #data #measurements #body').append('<div id="row"><span class="name">Height</span><span class="value">'+resp.payload.vitalSigns[i].bodyHeight+'</span></div>');
                            $('div #data #measurements #body').append('<div id="row"><span class="name">Weight</span><span class="value">'+resp.payload.vitalSigns[i].bodyWeight+'</span></div>');
                            $('div #data #measurements #body').append('<div id="row"><span class="name">DiastolicBp</span><span class="value">'+resp.payload.vitalSigns[i].diastolicBp+'</span></div>');
                         }
                for(var i=0; i<resp.payload.results.length; i++)
                    $('div #data #testResults #body').append('<div id="row"><span class="name">'+resp.payload.results[i].testName+'</span><span class="value">'+resp.payload.results[i].result+' '+resp.payload.results[i].units+'</span></div>');
                for(var i=0; i<resp.payload.immunizations.length; i++)
                    $('div #data #immunizations #body').append('<div id="row"><span class="name">'+resp.payload.immunizations[i].vaccine+'</span><span class="value">'+resp.payload.immunizations[i].status+'</span></div>');
                this.refreshScroll();
            },

            showConditions : function(){
                this.$('li').removeClass('selected');
                this.$('#show-conditions').addClass('selected');
                this.setActiveView('conditions');
                for(var i=0; i<resp.payload.problems.length; i++)
                    $('div #conditions #problems #body').append('<div id="row"><span class="name">'+resp.payload.problems[i].problem+'</span><span class="value">'+resp.payload.problems[i].status+'</span></div>');
                for(var i=0; i<resp.payload.procedures.length; i++)
                    $('div #conditions #procedures #body').append('<div id="row"><span class="name">'+resp.payload.procedures[i].procedure+'</span><span class="value">'+resp.payload.procedures[i].description+'</span></div>');
                for(var i=0; i<resp.payload.allergies.length; i++)
                    $('div #conditions #allergies #body').append('<div id="row"><span class="name">'+resp.payload.allergies[i].allergry+'</span><span class="value">'+resp.payload.allergies[i].reaction+'</span></div>');
                for(var i=0; i<resp.payload.encounters.length; i++)
                    $('div #conditions #recentVisits #body').append('<div id="row"><span class="name">'+resp.payload.encounters[i].encounter+'</span><span class="value">'+resp.payload.encounters[i].location+'</span></div>');
                this.refreshScroll();
            }

        });
        function setValue (){
            if (resp == "")
                controller.loadHealthHub(function (err, res){
                    if(res || resp == ""){
                        resp = res;
                        for(var i=0; i<resp.payload.vitalSigns.length; i++)
                         {  
                             $('div #data #measurements #body').append('<div id="row"><span class="name">Height</span><span class="value">'+resp.payload.vitalSigns[i].bodyHeight+'</span></div>');
                            $('div #data #measurements #body').append('<div id="row"><span class="name">Weight</span><span class="value">'+resp.payload.vitalSigns[i].bodyWeight+'</span></div>');
                            $('div #data #measurements #body').append('<div id="row"><span class="name">DiastolicBp</span><span class="value">'+resp.payload.vitalSigns[i].diastolicBp+'</span></div>');
                         }
                        for(var i=0; i<resp.payload.results.length; i++)
                            $('div #data #testResults #body').append('<div id="row"><span class="name">'+resp.payload.results[i].testName+'</span><span class="value">'+resp.payload.results[i].result+' '+resp.payload.results[i].units+'</span></div>');
                        for(var i=0; i<resp.payload.immunizations.length; i++)
                            $('div #data #immunizations #body').append('<div id="row"><span class="name">'+resp.payload.immunizations[i].vaccine+'</span><span class="value">'+resp.payload.immunizations[i].status+'</span></div>');
                        return;
                    }
                })
            else
            {
                for(var i=0; i<resp.payload.vitalSigns.length; i++)
                         {  
                             $('div #data #measurements #body').append('<div id="row"><span class="name">Height</span><span class="value">'+resp.payload.vitalSigns[i].bodyHeight+'</span></div>');
                            $('div #data #measurements #body').append('<div id="row"><span class="name">Weight</span><span class="value">'+resp.payload.vitalSigns[i].bodyWeight+'</span></div>');
                            $('div #data #measurements #body').append('<div id="row"><span class="name">DiastolicBp</span><span class="value">'+resp.payload.vitalSigns[i].diastolicBp+'</span></div>');
                         }
                for(var i=0; i<resp.payload.results.length; i++)
                    $('div #data #testResults #body').append('<div id="row"><span class="name">'+resp.payload.results[i].testName+'</span><span class="value">'+resp.payload.results[i].result+' '+resp.payload.results[i].units+'</span></div>');
                for(var i=0; i<resp.payload.immunizations.length; i++)
                    $('div #data #immunizations #body').append('<div id="row"><span class="name">'+resp.payload.immunizations[i].vaccine+'</span><span class="value">'+resp.payload.immunizations[i].status+'</span></div>');
                return;
            }
        };
    });
