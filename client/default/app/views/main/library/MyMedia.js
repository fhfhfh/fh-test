/*--------------------
	app/views/main/library/MyMedia

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/MyMedia.html',
        'text!templates/components/MyMediaFolder.html',
        'text!templates/components/MyMediaItem.html',
        'collections/Folders',
        'collections/Library',
], function($, _, Backbone, tpl, folderTpl, itemTpl, folderStore, libStore) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'myMedia',
	    events		: {
	    	'click .cabinetFolder' : 'displayFolder'
	    },
	    template	: _.template(tpl),
	    folderTpl 	: _.template(folderTpl),
	    itemTpl 	: _.template(itemTpl),


		initialize : function(){
			_.bindAll(this);
			this.folders  = folderStore.models;
			this.libStore = libStore.models;

			// force page refresh when objects added to collections
			folderStore.on('add', this.render);
			libStore.on('add', this.render);
			// this.iscroll = new iScroll(this.$('#cabinetHeader')[0]);
		},

		render: function(){
			console.log('render');
			var folders = this.populateFolders();
			var items = this.populateItems();
			this.$el.html(this.template({folders:folders, items: items}));
			this.thumbnailUpdate();
			return this;
		},

		populateFolders: function(){
            var folders = this.folders;
            var tpl = this.folderTpl;
            var str = '';
            for(var i=0; i<folders.length; i++){
                var item = folders[i].attributes;
                str+=tpl({id:item.id, name:item.name});
            }
            return str;
        },

        populateItems: function(){
            var items = this.libStore;
            var tpl = this.itemTpl;
            var str = '';
            for(var i=0; i<items.length; i++){
                var item = items[i].attributes;
                str+=tpl({
                	id		:item.id, 
                	shortTitle	:item.shortTitle,
                	title	:item.title,
                	type	: 'video',
                	folders	: item.folders
                });
            }
            return str;
        },

        thumbnailUpdate: function(){
        	var self=this,i;
        	var items = this.$('.cabinetItem');

        	for(i=0;i<items.length;i++){
        		var item = this.$(items[i]);
        		if(item.attr('data-id')){
        			var model =libStore.get(item.attr('data-id'));
        			item.find('.thumbnail').css({
        				'background':'url('+model.attributes.imgUrl+') no-repeat',
        				'background-size':'110px 70px',
        				'background-position':'8px 1px'
        			});
        		}
        	}
        },

		displayFolder: function(e){
			var target 	= e.currentTarget;
			var title 	= $(target).text();
			var id 		= $(target).attr('id');
			
			$('.cabinetFolder').removeClass('selected');
			$('.cabinetFolder .folderImg').attr('src', 'img/library/AllBoxes@2x.png');
			$(target).addClass('selected');
			$(target).find('.folderImg').attr('src', 'img/library/OpenBox@2x.png');
			// this.iscroll.refresh();

			if(id == 0){
				$('.cabinetItem').show();
				return;
			}

			var items = $('.cabinetItem');
			items.hide();

			for(var i=0; i<items.length; i++){
				var item = items[i];
				var folders = $(item).attr('folder') || '';

				if(folders.indexOf(id) >= 0){
					$(item).show();
				}
			}
		}

	});
});
