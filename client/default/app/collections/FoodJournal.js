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
		model: model,
		storageKey: 'peachy_foodJournal',

		dailyValues: {
			calories: 1500,
			fat: 20,
			sodium: 2300,
			carbohydrates: 200,
			cholesterol: 300,
			fibre: 25,
			protein: 45
		},

		initialize: function() {
			var self = this;
			this.on('change', function() {
				self.store();
				self.saveToCloud(self);
			});

		},

		addEntry: function(obj) {
			console.log(obj);

			var asset = new model(obj);
			this.add(asset);
			this.store();
		},

		createDay: function(date, existingModel) {
			console.log(date);
			var asset = existingModel || new model({
				date: date
			});
			this.add(asset);
			console.log(asset);
			console.log(this);
			return asset;

		},


		fetch: function() {
			this.load();
			return;
			var self = this;

			Act.call('fetchNewsAction', {},
				function(res) {
					var lib = res.payload.News;
					for (var i = 0; i < lib.length; i++) {
						var item = lib[i];
						item.imgData = "data:image/png;base64," + item.videoImgBase64;
						// self.addAsset(item);
					}
				}, function(err, msg) {
					console.log(err, msg);
				}
			);
		},

		store: function() {
			var models = JSON.stringify(this.models);
			Store.save(this.storageKey, models, function() {
				// console.log('saved foodJournal to localStorage');
			});
		},

		load: function() {
			var self = this;
			Store.load(this.storageKey, function(bool, res) {
				if (bool && res) {
					var obj = JSON.parse(res);
					console.log(obj);
					for (var i = 0; i < obj.length; i++) {
						var asset = new model(obj[i]);
						self.add(asset);
					}
				}
			});
		},

		saveToCloud: function(item) {
			// console.log("FJ saveToCloud");
			Act.call("saveJournalAction", {
					"item": item
				},
				function(res) {
					console.log(res);
				}, function(err, msg) {
					console.warn(err, msg);
				}
			);
		}

	});

	return new collection();
});