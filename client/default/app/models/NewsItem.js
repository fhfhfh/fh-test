/*------------------
app/models/NewsItem

Model for Headline news items
--------------------------*/

define(['backbone'], function(Backbone) {

	// TODO: Implement any custom logic necessary once backend in place.

	var newsItem = Backbone.Model.extend({

		title: 'No title available',
		description : 'No description available',
		newsId : '',
		url : ''

	});


	return newsItem;
});