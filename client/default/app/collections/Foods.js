/*
 * This is a Collection of all Foods from CalorieKing DB
 * which lives in FH cloud (mongoDB)
 */

define(['backbone',
		'models/FoodItem',
		'models/Acts',
		'models/Store'
		], function(Backbone, model, Act, Store) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		model : model,
		storageKey: 'peachy_foods',

		initialize: function(){
		},

		addEntry: function(obj){
		},

		// Get list of foods of a specific type
		getFoods: function(type, cb){
			var self = this;

			Act.call("fetchDBAction", {"type":type},
				function(res){
					console.log(res);
					self.populateCollection(res);
					return cb(res);
				}, function(err, msg){
					console.warn(err, msg);
				}
			);
		},

		populateCollection: function(list){
			var self = this;

			for(var i=0;i<list.length;i++){
				var asset = self.model(list[i]);
				self.add(asset);
			}
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