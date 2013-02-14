define(['backbone', 
		'models/NewsItem',
		'models/Acts'
		], function(Backbone, NewsItem, Act) {

	// TODO: Implement any custom logic necessary once backend in place.

	// interface---------------------------------
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
                                        var img = item.url.split('embed/')[1];
					var imgAddr = 'data:image/png;base64,'+newsArr[i].videoImgBase64;//'http://img.youtube.com/vi/'+img+'/0.jpg'
                                        console.log("\nvideo image source :- "+imgAddr);
					arr.push(
						new NewsItem({  
							'id' 				: item.newsId,
							'title'				: item.title, 
							'description'		: item.description,
							'shortDescription'	: short,
							'newsId'			: item.newsId,
							'url'				: item.url,
							'imgUrl' 			: imgAddr
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

	// implementation----------------------------

	return collection;
});