define(['backbone', 'models/NewsItem'], function(Backbone, NewsItem) {

	// TODO: Implement any custom logic necessary once backend in place.

	// interface---------------------------------
	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		model : NewsItem

	});

	// implementation----------------------------

	return collection;
});