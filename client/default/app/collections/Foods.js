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
		foods : [],

		initialize: function(){
			var a = {name:"Eoin",lName:"Crosbie"};
			var b = {name:"Brandon",lName:"Crosbie"};
			var c = {name:"Eoin",lName:"Murphy"};
			this.add(a);
			this.add(b);
			this.add(c);

		},

		search: function(type){
			var arr = [];
			this.each(function(model){
				var item = model;
				if(item.attributes.type === type){
					arr.push(item);
				}
			});
			return arr;
		},


		// Get list of foods of a specific type
		getFoods: function(type, cb){
			var self = this;

			if(self.foods[type]){
				var list = self.search(type);
				return cb(list);
			}

			Act.call("fetchDBAction", {"type":type},
				function(res){
					console.log(res);
					var name = res.payload.Name;
					var list = res.payload[name];

					var models = self.populateCollection(list[name], type);
					self.foods[type] = true;

					return cb(models);
				}, function(err, msg){
					console.warn(err, msg);
				}
			);
		},

		populateCollection: function(list, type){
			var self = this;
			
			for(var i=0;i<list.length;i++){
				var item =list[i];
				item.type = type
				var asset = new self.model(item);
				self.add(asset);
			}
			return this.search(type);
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