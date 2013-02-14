define(['backbone', 
		'models/NewsItem',
		'models/Acts'
		], function(Backbone, NewsItem, Act) {


	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		model : NewsItem,

		initialize: function(){
			var self = this;
		},


		fetch: function(){
			var newsArr = [];
			var arr = [];
			var self = this;

            Act.call('fetchNewsAction', {}, 
		        function(res){
		          var newsArr = res.payload.News;
                           console.log("\nres   :--"+JSON.stringify(res));
                           console.log("\n\nnewsArr   :--"+JSON.stringify(newsArr));
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
					var timeStr = min +":"+sec;

					arr.push(
						new NewsItem({  
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

	return collection;
});