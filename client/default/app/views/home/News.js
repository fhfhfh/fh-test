/*--------------------
	app/views/Headline-news

	View containing news items
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        'collections/NewsItems',
        'text!templates/components/News.html',
        'text!templates/components/NewsItem.html',
], function($, _, Backbone, NewsItems, template, itemTemplate) {

	//interface--------------------------------------
	var news = Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'news-and-information',
	    collection	: null,
	    events		: {
	    	'click #load-more-news': 'loadNews',
	    	'click .video-preview': 'playVideo'
	    },
	    template	: _.template(template),
	    itemTemplate: _.template(itemTemplate),
	    // el 		: $('#main-container'),

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
		loadNews 	: _loadNews, 	// Load more news items to page
		playVideo 	: _playVideo	// begin video playback
	});


	//implementation-------------------------------

	function _initialize(){
		_.bindAll(this);
		// TODO - move into collection file 
		this.collection = new NewsItems([
			{
				headline: 'Making Smart Choices',
				text: [
					'Hypoglycemia is the medical term for a low blood sugar level.',
					'Diet can help control hypoglycemia. Learn more about nutrition',
					'for hypoglycemia in this health video.'
				].join(' '),
				videoCaption: 'Choices For Hypoglycemics',
				duration: '23:10'
			},
			{
				headline: 'What is Type 1 Diabetes?',
				text: [
					'Diabetes is a disease wherein the body cannot produce adequate',
					'amounts of insulin to regulate blood sugar. Learn more about',
					'diabetes including treatment options in this medical video.'
				].join(' '),
				videoCaption: 'Living With Diabetes',
				duration: '12:32'
	        }
		]);

		this.collection.on('add', this.appendItems);
	};

	function _render(){
		var self = this;
		var itemsString = '';
		this.collection.forEach(function(item) {
			// console.log(item);
			itemsString += self.itemTemplate(item.toJSON());

		});
		this.$el.html(this.template({newsItems: itemsString}));
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