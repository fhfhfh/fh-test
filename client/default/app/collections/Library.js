/*
 * This is a Collection of all LibraryItems
 */

define(['backbone', 
		'models/LibraryItem',
		'models/Acts'
		], function(Backbone, LibraryItem, Act) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		model : LibraryItem,

		initialize: function(){
		},

		addAsset: function(obj){
			console.log(obj);
			obj.shortTitle = obj.title;
			if(obj.shortTitle.length > 20){
				obj.shortTitle = obj.shortTitle.substring(0,15) + '...';
			}

			var asset = new LibraryItem(obj);
			this.add(asset);
		},


		fetch: function(){
			var self=this;

            Act.call('fetchNewsAction', {}, 
		        function(res){
		        	var arr =[];
		          var newsArr = res.payload.News;
		          for(var i = 0; i<newsArr.length; i++){
					var item = newsArr[i];

					//create short description
					var short = item.description;
					if(short.length > 200){
						short = short.substring(0,200) + '...';
					}

					var imgData = "data:image/png;base64," + item.videoImgBase64;

					var time = parseInt(item.videoLength);
					var min = Math.floor(time/60);
					var sec = time - min*60;

					if(sec < 10){
						sec = "0" + sec;
					}
					var timeStr = min +":"+sec;

					arr.push(
						new LibraryItem({  
							'id' 				: item.newsId,
							'title'				: item.title, 
							'description'		: item.description,
							'shortDescription'	: short,
							'newsId'			: item.newsId,
							'url'				: item.url,
							'imgUrl' 			: imgData,
							'duration' 			: timeStr
						})
					);
					self.add(arr[i]);
				  }
				  return arr;

		        }, function(err, msg){
		          console.log(err, msg);
		        }
		    );
		},

	});

	return new collection();
});