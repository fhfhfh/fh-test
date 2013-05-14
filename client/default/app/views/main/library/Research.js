/*--------------------
	app/views/main/library/Research

--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'text!templates/components/Research.html',
    ], function($, _, Backbone, tpl) {

        return Backbone.View.extend({

            // Backbone specific attributes
            tagName		: 'section',
            id			: 'research',
            events		: {
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
            }

        });
    });
