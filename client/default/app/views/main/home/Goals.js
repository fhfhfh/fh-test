/*--------------------
	app/views/Goals

	View containing user goals
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        // 'highChart',
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
		addGoal 	: _addGoal,
		displayGoals: _displayGoals

	});


	//implementation-------------------------------

	function _initialize(){
		_.bindAll(this);
	};

	function _render(){
		this.$el.html(template);
		var html = '<section id="goals">'+template+'</section>';
		this.displayGoals();
		return this;
	};

	function _addGoal(){
		// TODO: need flats from customer
	};

	function _displayGoals(){
		// chart1 = new Highcharts.Chart({
  //        chart: {
  //           renderTo: 'container',
  //           type: 'bar'
  //        },
  //        title: {
  //           text: 'Fruit Consumption'
  //        },
  //        xAxis: {
  //           categories: ['Apples', 'Bananas', 'Oranges']
  //        },
  //        yAxis: {
  //           title: {
  //              text: 'Fruit eaten'
  //           }
  //        },
  //        series: [{
  //           name: 'Jane',
  //           data: [1, 0, 4]
  //        }, {
  //           name: 'John',
  //           data: [5, 7, 3]
  //        }]
  //     });
	}


	return goals;

});
