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
    'text!templates/components/riskFactor.html',
    ], function($, _, Backbone, omnipidiaTpl,tpl,omniDetailsTpl,informationTpl,infoDetailsTpl,interactionsTpl,riskFactorTpl) {

        return Backbone.View.extend({

            // Backbone specific attributes
            tagName		: 'section',
            id			: 'research',
            events		: {
                'click #menu1, #omnibtn1' : 'showOmnipidia',
                'click #menu2, #omnibtn2' : 'showInformation',
                'click #menu3, #omnibtn3' : 'showInteractions',
                'click #menu5, #omnibtn5' : 'showRiskFactor',
                'click #quitBtn' : 'render',
                'click #omniListArea #omniDetails .boxEntry' : 'showOmnipidiaDetails',
                'click #infoListArea #infoDetails .boxEntry' : 'showInformationDetails',
                'click #infoBtn, #omnibtn, .research-menuBtn':'showMenu',
                'click #interaction-myMedia':'showMyMedia',
                'click #interaction-search':'showSearch',
                'click #riskFactor-general':'showGenRisk',
                'click #riskFactor-lifestyle':'showlifestyle'
 
            },
            template	: _.template(tpl),


            initialize : function(){
                _.bindAll(this);
            },

            render: function(){
                var self = this;

                this.$el.html(this.template());
                this.bodyScroll = new iScroll(this.$('#research-desk')[0],{
                    bounceLock	: true,
                    bounce 		: false,
                    vScrollbar 	: true
                });
                this.refreshScroll();
                //                this.loadList();
                return this;
            },
            
            showOmnipidia: function(e){
                var target = e.currentTarget;
                var page = $(this.el);

                var details = _.template(omnipidiaTpl);
                var title = $(target).find('h1').text() || 'Untitled';
                // var info = $(target).attr('info');
                var imgSrc = $(target).find('img').attr('src');

                this.$el.html(details({
                    title: title,
                    description: "info",
                    src: imgSrc
                }));
                this.loadListOmni();
            },
            
            showInformation: function(e){
                var target = e.currentTarget;
                var page = $(this.el);

                var details = _.template(informationTpl);
                var title = $(target).find('h1').text() || 'Untitled';
                // var info = $(target).attr('info');
                var imgSrc = $(target).find('img').attr('src');

                this.$el.html(details({
                    title: title,
                    description: "info",
                    src: imgSrc
                }));
                this.loadListInfo();
            },
            
            showInteractions: function(e){
                var target = e.currentTarget;
                var page = $(this.el);

                var details = _.template(interactionsTpl);
                var title = $(target).find('h1').text() || 'Untitled';
                // var info = $(target).attr('info');
                var imgSrc = $(target).find('img').attr('src');

                this.$el.html(details({
                    title: title,
                    description: "info",
                    src: imgSrc
                }));
                this.showMyMedia();
            },
            
            showRiskFactor: function(e){
                var target = e.currentTarget;
                var page = $(this.el);
                var details = _.template(riskFactorTpl);
                this.$el.html(details);
                this.showGenRisk();
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
                this.$('#lifestyle').attr("style","display:none");
                this.$('#general-risk').attr("style","display:block");
            },
            
            showlifestyle: function(e){
                this.$('li').removeClass('selected');
                this.$('#riskFactor-lifestyle').addClass('selected');
                this.$('#lifestyle').attr("style","display:block");
                this.$('#general-risk').attr("style","display:none");
            },
            
            showInformationDetails: function(e){
                var target = e.currentTarget;
                var page = $(this.el);

                var details = _.template(infoDetailsTpl);
                var title = $(target).find('h1').text() || 'Untitled';
                // var info = $(target).attr('info');
                var imgSrc = $(target).find('img').attr('src');

                this.$el.html(details({
                    title: title,
                    description: "info",
                    src: imgSrc
                }));
            },
                
                
            showOmnipidiaDetails: function(e){
                var target = e.currentTarget;
                var page = $(this.el);

                var details = _.template(omniDetailsTpl);
                var title = $(target).find('h1').text() || 'Untitled';
                // var info = $(target).attr('info');
                var imgSrc = $(target).find('img').attr('src');

                this.$el.html(details({
                    title: title,
                    description: "info",
                    src: imgSrc
                }));
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
            
            showMenu : function(){
                $("#research-menu").attr("style","visibility:visible")
            }

        });
    });
