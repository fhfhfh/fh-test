define(['backbone',
	'models/NewsItem',
	'models/Acts',
	'models/Store'
], function(Backbone, NewsItem, Act, Store) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		model: NewsItem,
		watched: [],

		initialize: function() {
			var self = this;

			this.loadWatched();
		},


		fetch: function() {
			var newsArr = [];
			var arr = [];
			var self = this;

			Act.call('fetchNewsAction', {},
				function(res) {
					var newsArr = res.payload.News;
					for (var i = 0; i < newsArr.length; i++) {
						var item = newsArr[i];

						//create short description
						var shortName = item.description;
						if (shortName.length > 200) {
							shortName = shortName.substring(0, 200) + '...';
						}

						var imgData = "data:image/png;base64," + item.videoImgBase64;

						var time = parseInt(item.videoLength, 10);
						var min = Math.floor(time / 60);
						var sec = time - min * 60;

						if (sec < 10) {
							sec = "0" + sec;
						}
						var timeStr = min + ":" + sec;

						arr.push(
							new NewsItem({
								'id': item.newsId,
								'title': item.title,
								'description': item.description,
								'shortDescription': shortName,
								'newsId': item.newsId,
								'url': item.url,
								'imgUrl': imgData,
								'duration': timeStr
							})
						);
						self.add(arr[i]);
					}
					return arr;

				}, function(err, msg) {
					console.log(err, msg);
				}
			);
		},

		videoWatched: function(id) {
			var self = this;
			var save = true;

			var model = this.get(id);
			if (model) {
				// don't save if video is already in list
				self.watched.forEach(function(item) {
					if (item.id == id) {
						save = false;
					}
				});

				if (save) {
					var obj = {
						id: id
					};
					self.watched.push(obj);
					Store.save('peachy_watchedItem', JSON.stringify(self.watched), function() {
						console.log('saved watched item id');
					});
				}

				// TODO : tell peachy what video was watched
			}
		},

		checkVideo: function(id) {
			var watched = this.watched;
			for (var i = 0; i < watched.length; i++) {
				if (id === watched[i].id) {
					return true;
				}
			}
		},

		loadWatched: function() {
			console.log('loading Watched');
			var self = this;
			Store.load('peachy_watchedItem', function(bool, res) {
				if (bool && res) {
					var obj = JSON.parse(res);
					// console.log(obj);
					for (var i = 0; i < obj.length; i++) {
						self.watched.push(obj[i]);
					}
				}
			});
			// console.log(self.watched);
		}

	});

	return collection;
});