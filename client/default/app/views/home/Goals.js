/*--------------------
	app/views/Goals

	View containing user goals
--------------------*/
define(['jquery',
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
	    	'click #add-goal' : 'addGoal'
	    },
	    template	: _.template(template),
	    el 		: $('#home-content'),

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
		addGoal 	: _addGoal

	});


	//implementation-------------------------------

	function _initialize(){
		_.bindAll(this);
	};

	function _render(){
		this.$el.html(template);
		var html = '<section id="goals">'+template+'</section>';

		return html;
	};

	function _addGoal(){
		// TODO: need flats from customer
	};


	return goals;

});
