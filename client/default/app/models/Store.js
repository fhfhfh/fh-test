/*--------------------
	app/models/Store

	Module used to save/load values to/from local storage
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'models/User',
        'map'
], function($, _, Backbone, User, map) {


	//interface----------------------------------
	Peachy.Models.Store = {

		save : _save, 	// save a model to local storage
		load : _load,	// load a model from local storage
		clear: _clear 	// clear all local storage
	};

	//implementation-------------------------------

	function _save(modelName, model, callback){
		var model = model || {};

		
	}

	return Peachy.Models.Store;

});