/*--------------------
	app/views/Loading

	Loading page displayed while logging in
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/pages/Loading.tpl',
], function($, _, Backbone, template) {

	//interface--------------------------------------
	Peachy.Views.Loading = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'loading',

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
		changePage 	: _changePage 	// Show homepage after waiting four seconds
	});


	//implementation-------------------------------
	function _initialize(){
		this.render();
	};

	function _render(){
		var self = this;
		var $el = $('body').html(template);

		// call function to change to homepage after 4 seconds
		self.changePage();

		return $el;
	};

	function _changePage(){
		setTimeout(function(){
			App.navigate('home', {trigger: true});
		}, 4000);
	}



	return Peachy.Views.Loading;

});