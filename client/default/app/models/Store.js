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
		// $fh.data({
		// 	act : 'save',
		// 	key : modelName,
		// 	val : model
		// }, function(){
  //                       console.log("SESSION SAVE"+model);
		// 	return callback(true);
		// }, function(msg, err){
		// 	return callback(msg, err);
		// });
	};

	function _load(modelName, callback){

		var res =localStorage.getItem(modelName);
		return callback(true, res);
		
		// $fh.data({
		// 	key : modelName
		// }, function(res){
		// 	return callback(true, res);
		// }, function(msg, err){
		// 	return callback(msg, err);
		// });
	};

	function _clear(modelName, callback){

		$fh.data({
			act : 'remove',
			key : modelName
		}, function(){
			return callback(true);
		}, function(msg, err){
			return callback(msg, err);
		});
	};

	function _clearAll(callback){
		// TODO -- write clear all function to wipe storage
	};

	return store;

});