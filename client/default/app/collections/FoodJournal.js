/*
 * This is a Collection of all LibraryItems
 */

define(['backbone', 
		'models/JournalDay',
		'models/Acts',
		'models/Store'
		], function(Backbone, model, Act, Store) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		model : model,
		storageKey: 'peachy_foodJournal',

		initialize: function(){
			var self=this;
			this.on('change', function(){
				self.store();
			});

			// TODO : remove dummy data
			var asset = new model({
				breakfast : [
					{name: "Scone", about: "1 piece", calories: "100"},
					{name: "Coffee", about: "2 cups", calories: "90"},
					]
			});
			this.add(asset);
		},

		addEntry: function(obj){
			console.log(obj);
			
			var asset = new model(obj);
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
			Store.save(this.storageKey, models, function(){
				console.log('saved library to localStorage');
			});
		},

		load: function(){
			var self = this;
			Store.load(this.storageKey, function(bool,res){
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