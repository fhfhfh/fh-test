/*
 * This is a Collection of Suggested LibraryItems
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
		},

		store: function(){
			var models = JSON.stringify(this.models);
			Store.save('peachy_librarySuggested', models, function(){
				console.log('saved library to localStorage');
			});
		},

		load: function(){
			var self = this;
			Store.load('peachy_librarySuggested', function(bool,res){
				if(bool && res){
					var obj = JSON.parse(res);
					for(var i=0;i<obj.length;i++){
						self.add(obj[i]);
					}
				}
			});
		}

	});

	return new collection();
});