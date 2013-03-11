define(['backbone',
		'models/Acts'
		], function(Backbone, Act) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		storageKey: 'peachy_folders',

		initialize: function(){
			//dummy data
			// this.add({id: 1,name: "Eoin's Stuff"});
			// this.add({id: 2,name: "Crosbie"});
			// this.add({id: 3,name: "Interests"});
			// this.add({id: 4,name: "Random"});
			// this.add({id: 5,name: "Things"});
		},


		fetch: function(){
			console.log('Fetch Folders...')
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
			var id = length +1;
			this.add({id:id, name: name});
			this.sort(this.models);
			return id;
		},

		save: function(){

		}

	});

	return new collection();
});