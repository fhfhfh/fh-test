/*--------------------
	app/views/Loading

	Loading page displayed while logging in
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/pages/Loading.html',
], function($, _, Backbone, template) {

	//interface--------------------------------------
	var loading = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'loading',
	    el 		: $('body'),
	    template: template,

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
		changePage 	: _changePage, 	// Show homepage after waiting four seconds
	});


	//implementation-------------------------------
	function _initialize(){
		this.render();
	};

	function _render(){
		var self = this;
		this.$el.html(template);

		// call function to change to homepage after 4 seconds
		self.changePage();
		return this;
	};

	function _changePage(){
		setTimeout(function(){
			App.navigate('home', {trigger: true});
		}, 4000);
	}



	return loading;

});