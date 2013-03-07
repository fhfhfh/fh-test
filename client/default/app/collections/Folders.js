define(['backbone',
		'models/Acts'
		], function(Backbone, Act) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		storageKey: 'peachy_folders',

		initialize: function(){
			//dummy data
			this.add({id: 1,name: "Eoin's Stuff"});
			this.add({id: 2,name: "Crosbie"});
			this.add({id: 3,name: "Interests"});
			console.log(this);
		},


		fetch: function(){
			console.log('Fetch Folders...')
		},

		addFolder: function(name){
			this.add({name: name});
			console.log(this);
		},

		save: function(){

		}

	});

	return new collection();
});