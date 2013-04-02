define(['backbone',
		'models/Acts',
		'models/Store'
		], function(Backbone, Act, Store) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		storageKey: 'peachy_folders',
		index: 2,

		initialize: function(){
			//dummy data
			// this.add({id: 1,name: "Eoin's Stuff"});
			// this.add({id: 2,name: "Crosbie"});
			// this.add({id: 3,name: "Interests"});
			// this.add({id: 4,name: "Random"});
			// this.add({id: 5,name: "Things"});
		},


		/*
		 * Fetch - try to load folders from
		 * localSotrage, if fails, fetch from cloud DB
		 */
		fetch: function(){
			var self = this;
			console.log('Fetch Folders...');
			this.load(function(filesExist){
				if(filesExist){
					console.log('Local Folders fetched');
					return;
				}
				else {
					Act.call('folderManagerAction', {method:'viewAll'}, function(res){
						if(res){
							var count = res.payload.count;
							var list = res.payload.list;

							for(var i=0; i<count;i++){
								var item = list[i].fields;
								self.addFolder(item.name);
							}
						}
					}, function(err, msg){

					});
				}
			});
		},

		sort: function(array){
			array.sort(function(a,b){
				var aName =a.attributes.name.toLowerCase(); 
				var bName =b.attributes.name.toLowerCase();
				if(aName<bName) return -1;
			    if(aName>bName) return 1;
			    return 0;
			});
		},

		addFolder: function(name){
			var length = this.models.length;
			var id = this.index;
			this.index = this.index +1;

			this.add({id:id, name: name});
			this.sort(this.models);
			this.store();
			return id;
		},

		store: function(){
			var models = JSON.stringify(this.models);
			Store.save(this.storageKey, models, function(){
				console.log('saved folders to localStorage');
			});
		},


		/*
		 * Save folder items to cloud DB
		 */
		save: function(){
			var params = {method: "add"};
			var record = [];
			var models = this.models;
			var i;
			for(i=0;i<models.length;i++){
				var item = models[i].attributes;

				record.push({
					id: item.id,
					name: item.name
				});
			}

			params.record = record;

			Act.call('folderManagerAction', params, function(res){
				console.log('Saved Folders');
			}, function(err, msg){
				console.log('Saving Folders Failed', err);
			});
		},

		load: function(callback){
			var self = this;
			Store.load(this.storageKey, function(bool,res){
				if(bool && res){
					var obj = JSON.parse(res);
					for(var i=0;i<obj.length;i++){
						self.addFolder(obj[i].name);
					}
					return callback(true);
				}
				else {
					return callback(false);
				}
			});
		}

	});

	return new collection();
});