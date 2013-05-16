/*--------------------
	app/views/main/library/Research

--------------------*/
define(['jquery',
    'underscore',
    'backbone',
     'text!templates/components/Omnipedial.html',
    'text!templates/components/Research.html',
    'text!templates/components/OmnipediaDetails.html',
    ], function($, _, Backbone, omnipidiaTpl,tpl,omniDetailsTpl) {

        return Backbone.View.extend({

            // Backbone specific attributes
            tagName		: 'section',
            id			: 'research',
              events		: {
//    		'click #menu1' : 'showOmnipidia',
                'click #quitBtn' : 'render'
//                'click #omniDetails' : 'showOmnipidiaDetails'
 
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
                    vScrollbar 	: false
                });
                this.refreshScroll();
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
		}

        });
    });
