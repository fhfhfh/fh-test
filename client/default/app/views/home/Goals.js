/*--------------------
	app/views/Goals

	View containing user goals
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/components/Goals.html'
], function($, _, Backbone, template) {

	//interface--------------------------------------
	var goals = Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'goals',
	    events		: {
	    },
	    template	: _.template(template),
	    el 		: $('#home-content'),

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template

	});


	//implementation-------------------------------

	function _initialize(){
		_.bindAll(this);
	};

	function _render(){
		this.$el.html(template);
		return this.$el;
	};


	return goals;

});