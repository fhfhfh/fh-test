/*--------------------
	app/views/Goals

	View containing user goals
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/components/cal.html'
], function($, _, Backbone, template) {

	//interface--------------------------------------
	var calendar1 = Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'calendar1',
	    events		: {
	    },
	    template	: _.template(template),
	    el 		: $('#home-content'),

	    //Function interface
		initialize	: _initialize,
		render		: _render		// return template

	});


	//implementation-------------------------------

	function _initialize(){
		_.bindAll(this);


                var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();


	}

	function _render(){
		this.$el.html(template);
		return this;
	}

	return calendar1;

});
