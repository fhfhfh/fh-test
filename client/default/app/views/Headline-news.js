/*--------------------
	app/views/Headline-news

	View containing news items
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'text!templates/components/Headline-news.tpl',
        'collections/NewsItems'
], function($, _, Backbone, Newstemplate, NewsItems) {

	//interface--------------------------------------
	var news = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'headline-news',
	    events  : {
	    	'click #load-more-news': 'loadNews'
	    },
	    template: Newstemplate,
	    el 		: $('body'),

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

		this.collection.on('add', this.appendItems);
		this.render();
	};

	function _render(){
		var itemsString = '';
		this.collection.forEach(function(item) {
			itemsString += self.itemTemplate(item.toJSON());
		});
		
		this.$el.html(this.template({newsItems: this.collection.toJSON()}));
		return this;
	};

	function _appendItems(items) {
      if (!items.length) {
        this.$('ul').append(this.itemTemplate(items.toJSON()));
      } else {
        var itemsString = '';
        items.forEach(function(item) {
          itemsString += self.itemTemplate(item.toJSON());
        });
        this.$('ul').append(itemsString);
      }
      this.refreshScroll();
    };

    function _loadNews() {

      // TODO: Implement proper functionality once API is in place.
      this.collection.add(this.collection.toJSON());
    };

    function _playVideo(element) {
      var video = $(element.currentTarget).find('video')[0];

      // There's no need to do any paused state checking for now; the PhoneGap
      // variant will only play in fullscreen, and so the element will NOT be
      // clickable once playing.
      video.play();
    };

	return news;

});