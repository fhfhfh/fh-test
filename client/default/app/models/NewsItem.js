/*------------------
app/models/NewsItem

Model for Headline news items
--------------------------*/

define(['backbone'], function(Backbone) {

	// TODO: Implement any custom logic necessary once backend in place.

	var newsItem = Backbone.Model.extend({

		defaults: {
			title			: 'Untitled',
			description		: 'Description not available',
			shortDescription: 'Description not available',
			watched			: ''
		},

		initialize: function(){
		},

	});


	return newsItem;
});