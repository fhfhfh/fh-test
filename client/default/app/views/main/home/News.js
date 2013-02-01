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
	    	'click .clearfix' : 'videoScreen'
	    },
	    template	: _.template(template),
	    itemTemplate: _.template(itemTemplate),

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
		loadNews 	: _loadNews, 	// Load more news items to page
		appendItems : _appendItems,
		videoScreen	: _videoScreen
	});


	//implementation-------------------------------

	function _initialize(){
		var self = this;
		_.bindAll(this);
		this.collection = new NewsItems();
		this.collection.on('add', this.appendItems);

		setInterval(function(){
			if(self.visible == 0){
				$('#show-news aside.badge').html('');	
			}else {
				$('#show-news aside.badge').html(self.visible);
			}
			
		}, 1000);
	};

	function _render(){
		var self = this;
		var itemsString = '';

		this.collection.fetch();
		this.collection.forEach(function(item) {
			itemsString += self.itemTemplate(item.toJSON());
		});
		this.$el.html(this.template({newsItems: itemsString}));
		this.visible = $('.clearfix').length;
		return this;
	};

	function _appendItems(items) {
		var self = this;
		// if($('.clearfix').length >0){
		// 	return;
		// }
		if (!items.length) {
			this.$('ul').append(this.itemTemplate(items.toJSON()));
		} else {
      	console.log(self.collection);
        var itemsString = '';
		itemsString += self.itemTemplate(self.collection.at(0).toJSON());
        this.$('ul').append(itemsString);
      }
      this.refreshScroll();
      this.visible = $('.clearfix').length;
    };

    function _loadNews() {

    	if($('.clearfix').length >5){
			Backbone.trigger('notify', 'No more news available');
			return;
		}
		this.collection.reset();
		this.collection.fetch();
    	console.log('load');
    };

    //show video and details on full screen
    function _videoScreen(e) {
    	e.preventDefault();
    	e.stopPropagation();
    	var id		= $(e.currentTarget).closest('li').attr('data-id');
    	var item	= this.collection.get(id);
    	
    	localStorage.setItem('tempVid', JSON.stringify(item));
    	Backbone.history.navigate('video', true, true);

	};

 

	return news;

});
