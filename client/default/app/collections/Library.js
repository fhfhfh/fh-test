/*
 * This is a Collection of all LibraryItems
 */

define(['backbone', 
		'models/LibraryItem',
		'models/Acts'
		], function(Backbone, LibraryItem, Act) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		model : LibraryItem,

		initialize: function(){
		},

		addAsset: function(obj){
			console.log(obj);
			obj.shortTitle = obj.title;
			if(obj.shortTitle && obj.shortTitle.length > 20){
				obj.shortTitle = obj.shortTitle.substring(0,15) + '...';
			}

			var asset = new LibraryItem(obj);
			this.add(asset);
		},


		fetch: function(){
			var self=this;

            Act.call('fetchNewsAction', {}, 
		        function(res){
					var lib = res.payload.News;
					for(var i = 0; i<lib.length; i++){
						var item = lib[i];
						item.imgData = "data:image/png;base64," + item.videoImgBase64;
						// self.addAsset(item);
					}
		        }, function(err, msg){
		          console.log(err, msg);
		        }
		    );
		},

	});

	return new collection();
});