/*--------------------
	app/models/Store

	Module used to save/load values to/from local storage
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'feedhenry'
], function($, _, Backbone, $fh) {


	//interface----------------------------------
	var store = {

		save	: _save, 	// save a model to local storage
		load	: _load,	// load a model from local storage
		clear	: _clear, 	// clear a model from local storage
		clearAll: _clearAll // wipe local storage
	};

	//implementation-------------------------------

	function _save(modelName, model, callback){
		var model = model || {};

		localStorage.setItem(modelName, model);
		return callback(true);
	};

	function _load(modelName, callback){

		var res =localStorage.getItem(modelName);
		return callback(true, res);
	};

	function _clear(modelName, callback){

		localStorage.removeItem(modelName);
		return callback(true);
	};

	function _clearAll(callback){

		console.log('Clearing LocalStorage');
		localStorage.clear();
		return true;

	};

	return store;

});