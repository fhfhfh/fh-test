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


		fetch: function(){
			console.log('Fetch Folders...');
			this.load();
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
			Store.save('peachy_folders', models, function(){
				console.log('saved folders to localStorage');
			});
		},

		load: function(){
			var self = this;
			Store.load('peachy_folders', function(bool,res){
				if(bool && res){
					var obj = JSON.parse(res);
					console.log(obj);
					for(var i=0;i<obj.length;i++){
						self.addFolder(obj[i].name);
					}
				}
			});
		}

	});

	return new collection();
});