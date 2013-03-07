/*--------------------
	app/views/main/library/MyMedia

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/MyMedia.html',
], function($, _, Backbone, tpl) {

	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'myMedia',
	    events		: {
	    	'click .cabinetFolder' : 'displayFolder'
	    },
	    template	: _.template(tpl),


		initialize : function(){
			_.bindAll(this);
			this.$el.html(this.template());

			// this.iscroll = new iScroll(this.$('#cabinetHeader')[0]);
		},

		render: function(){
			return this;
		},

		displayFolder: function(e){
			var target 	= e.currentTarget;
			var title 	= $(target).text();

			$('.cabinetFolder').removeClass('selected');
			$('.cabinetFolder .folderImg').attr('src', 'img/library/AllBoxes@2x.png');
			$(target).addClass('selected');
			$(target).find('.folderImg').attr('src', 'img/library/OpenBox@2x.png');
			// this.iscroll.refresh();

			title = title.toLowerCase().replace(' ', '');

			var items = $('.cabinetItem');
			items.hide();

			for(var i=0; i<items.length; i++){
				var item = items[i];
				var folders = $(item).attr('folder') || '';

				if(folders.indexOf(title) >= 0){
					$(item).show();
				}
			}
		}

	});
});
