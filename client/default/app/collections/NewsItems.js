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

			console.log('Fetching...');
            Act.call('fetchNewsAction', {}, 
		        function(res){
		          var newsArr = res.payload.News;

		          for(var i = 0; i<newsArr.length; i++){
					var item = newsArr[i];

					//create short description
					var short = item.description;
					if(short.length > 200){
						short = short.substring(0,200) + '...';
					} 

					arr.push(
						new NewsItem({  
							'id' 				: item.newsId,
							'title'				: item.title, 
							'description'		: item.description,
							'shortDescription'	: item.description.substring(0, 200) + '...',
							'newsId'			: item.newsId,
							'url'				: item.url
						})
					);
					self.add(arr[i]);
				  }
				  console.log(arr);
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