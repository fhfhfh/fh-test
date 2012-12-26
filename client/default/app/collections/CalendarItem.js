define(['backbone', 'models/CalendarItem'], function(Backbone, CalendarItem) {

	// TODO: Implement any custom logic necessary once backend in place.

	// interface---------------------------------
	var collection = Backbone.Collection.extend({
		//Backbone specific attributes
		model : CalendarItem

	});

	// implementation----------------------------

	return collection;
});