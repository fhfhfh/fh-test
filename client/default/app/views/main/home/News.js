/*--------------------
	app/views/Headline-news

	View containing news items
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'collections/NewsItems',
        'text!templates/components/News.html',
        'text!templates/components/NewsItem.html',
        'views/WelcomeVideo',
        'models/Acts'
], function($, _, Backbone, NewsItems, template, itemTemplate, WelcomeVideo, Act) {

	//interface--------------------------------------
	var news = Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'news-and-information',
	    NewsIndex 	: 0,
	    visible		: 0,
	    events		: {
	    	'click #load-more-news': 'loadNews',
	    	'click .description' : 'videoScreen'
	    },
	    template	: _.template(template),
	    itemTemplate: _.template(itemTemplate),
	    // el 		: $('#main-container'),

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
		loadNews 	: _loadNews, 	// Load more news items to page
		appendItems : _appendItems,
		videoScreen	: _videoScreen
	});


	//implementation-------------------------------

	function _initialize(){
		_.bindAll(this);
		this.collection = new NewsItems();
		this.collection.on('add', this.appendItems);
	};

	function _render(){
		var self = this;
		var itemsString = '';
		this.collection.fetch();
		this.collection.forEach(function(item) {
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
		itemsString += self.itemTemplate(self.collection.at(self.NewsIndex).toJSON());
		itemsString += self.itemTemplate(self.collection.at(self.NewsIndex+1).toJSON());
        this.$('ul').append(itemsString);
      }
      this.refreshScroll();
    };

    function _loadNews(e) {
    	e.preventDefault();
    	e.stopPropagation();
    	if(this.NewsIndex <= this.visible){
    		Backbone.trigger('notify', 'No more news available');
    		return;
    	}
    	console.log('load');
    };

    //show video and details on full screen
    function _videoScreen(e) {
    	e.preventDefault();
    	e.stopPropagation();
    	var id		= $(e.currentTarget).closest('li').attr('data-id');
    	var item	= this.collection.get(id);
    	console.log(id, item);
    	// TODO: change to videoScreen here
	};

 

	return news;

});
