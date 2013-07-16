/*
 * This is a Collection of all user Medicines
 */

define(['backbone',
		'models/MedicineItem',
		'models/Acts',
		'models/Store'
		], function(Backbone, model, Act, Store) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		model : model,
		storageKey: 'peachy_medicines',


		initialize: function(){
			var self=this;
			this.on('change', function(){
				self.store();
			});

		},

		addEntry: function(obj){
			console.log(obj);

			var asset = new model(obj);
			this.add(asset);
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
				console.log('saved medicines to localStorage');
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
		},

		saveToCloud: function(item){
			Act.call("saveJournalAction", {"item":item},
				function(res){
					console.log(res);
				}, function(err, msg){
					console.warn(err, msg);
				}
			);
		}

	});

	return new collection();
});