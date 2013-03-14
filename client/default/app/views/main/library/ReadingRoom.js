/*--------------------
	app/views/main/library/ReadingRoom

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/ReadingRoom.html',
        'text!templates/components/ReadingRoomRow.html',
        'collections/Library',
], function($, _, Backbone, tpl, tpl2, libStore) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'readingRoom',
	    events		: {
	    	"click #item" : "displayFile"
	    },
	    template	: _.template(tpl),
	    rowTpl 		: _.template(tpl2),


		initialize : function(){
			_.bindAll(this);
		},

		render: function(){
			var self = this;

			var rows = this.populate();

			this.$el.html(this.template({rows: rows}));
			return this;
		},

		populate: function(){
			var src = {
				video: "img/library/PlayWhiteSmall.png",
				article: "img/library/ArticleWhiteSmall.png",
				web: "img/library/GlobeWhiteSmall.png",
				};

            var items = libStore.models;
            var tpl = this.rowTpl;
            var str = '';
            for(var i=0; i<items.length; i++){
                var item = items[i].attributes;
                if(item.folders.indexOf(1) >= 0){
                	str+=tpl({
	                	id		:item.id, 
	                	name	:item.title,
	                	type	: 'video',
	                	date 	: 'Today',
	                	src 	: src.video,
	                	folders	: item.folders
	                });	
                }
            }
            return str;
		},

		displayFile: function(e){
			console.log(e);
			var target 	= e.currentTarget;
			var title 	= $(target).text();
			var id 		= $(target).attr('data-id');
			var type 	= $(target).attr('type');
			var model 	= libStore.get(id);

			if(type == 'video'){
				localStorage.setItem('tempVid', JSON.stringify(model));
		    	Backbone.history.navigate('video', true, true);
			}
		}

	});
});
