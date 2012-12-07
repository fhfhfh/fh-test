/*--------------------
	app/views/Headline-news

	View containing news items
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/components/Headline-news.tpl',
        'collections/NewsItems'
], function($, _, Backbone, template, NewsItems) {

	//interface--------------------------------------
	Peachy.Views.HeadlineNews = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'headline-news',
	    events  : {
	    	'click #load-more-news': 'loadNews'
	    },

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
		loadNews 	: _loadNews 	// Load more news items to page
	});


	//implementation-------------------------------
	function _initialize(){
		// TODO - move into collection file 
		this.collection = new NewsItems([
			{
				headline: 'Making Smart Choices',
				text: 'Hypoglycemia is the medical term for a low blood sugar level. Diet can help control hypoglycemia. Learn more about nutrition for hypoglycemia in this health video.',
				videoCaption: 'Choices For Hypoglycemics'
			},
			{
				headline: 'What is Type 1 Diabetes?',
				text: 'Diabetes is a disease wherein the body cannot produce adequate amounts of insulin to regulate blood sugar. Learn more about diabetes including treatment options in this medical video.',
				videoCaption: 'Living With Diabetes'
			}
		]);
		this.render();
	};

	function _render(){
		this.$el.html(template({newsItems: this.collection.toJSON()}));
		return this;
	};

	function _loadNews(){

	};

	return Peachy.Views.HeadlineNews;

});