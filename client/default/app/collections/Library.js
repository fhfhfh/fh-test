/*
 * This is a Collection of all LibraryItems
 */

define(['backbone', 
		'models/LibraryItem',
		'models/Acts',
		'models/Store'
		], function(Backbone, LibraryItem, Act, Store) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		model : LibraryItem,

		initialize: function(){
			var self=this;
			this.on('change', function(){
				self.store();
			});
		},

		addAsset: function(obj){
			console.log(obj);
			obj.shortTitle = obj.title;
			if(obj.shortTitle && obj.shortTitle.length > 20){
				obj.shortTitle = obj.shortTitle.substring(0,15) + '...';
			}

			var asset = new LibraryItem(obj);
			this.add(asset);
			this.store();
		},


		fetch: function(){
			this.load();
			return;
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

		store: function(){
			var models = JSON.stringify(this.models);
			Store.save('peachy_library', models, function(){
				console.log('saved library to localStorage');
			});
		},

		load: function(){
			var self = this;
			Store.load('peachy_library', function(bool,res){
				if(bool && res){
					var obj = JSON.parse(res);
					console.log(obj);
					for(var i=0;i<obj.length;i++){
						self.add(obj[i]);
					}
				}
			});
		}

	});

	return new collection();
});