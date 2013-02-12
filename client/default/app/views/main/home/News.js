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


	return Backbone.View.extend({

		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'news-and-information',
	    visible		: 0,
	    badgeNum	: 0,
	    events		: {
	    	'click #load-more-news': 'loadNews',
	    	'click .clearfix' : 'videoScreen'
	    },
	    template	: _.template(template),
	    itemTemplate: _.template(itemTemplate),



		initialize: function(){
			var self = this;
			_.bindAll(this);
			this.collection = new NewsItems();
			this.collection.on('add', this.appendItems);

			setInterval(function(){
				if(self.badgeNum == 0){
					$('#show-news aside.badge').html('');	
				}else {
					$('#show-news aside.badge').html(self.badgeNum);
				}
			}, 1000);
		},

		render: function(){
			var self = this;
			var str = '';

			for(var i =0; i<self.visible; i++){
				str += self.itemTemplate(self.collection.at(i).toJSON());
			}

			this.checkNews();
			this.watched();
			this.$el.html(this.template({newsItems: str}));
			return this;
		},

		refreshScroll: function(){
			if(this.container){
				this.container.refreshScroll();  
			}
		},

		checkNews: function(){
			// check if collection is empty
			if(this.collection.isEmpty()){
				this.collection.fetch();
			}
		},

		appendItems: function(items) {
			var self = this;
			if (!items.length) {
				if(self.visible <2){
					this.$('ul').append(this.itemTemplate(items.toJSON()));
					self.visible = self.visible + 1;	
				}
				
			} else {
		        var itemsString = '';
				itemsString += self.itemTemplate(self.collection.at(0).toJSON());
		        this.$('ul').append(itemsString);
			}
			this.refreshScroll();
	    },

	    loadNews: function() {
	    	var self = this;
	    	var str  = '';

	    	if($('.clearfix').length == this.collection.length){
				Backbone.trigger('notify', 'No more news available');
				return;
			} else if(('.clearfix').length == this.collection.length -1){
				str += self.itemTemplate(self.collection.at(self.visible).toJSON());
				this.$('ul').append(str);
		        self.visible = self.visible + 1;
			} else {
				str += self.itemTemplate(self.collection.at(self.visible).toJSON());
				str += self.itemTemplate(self.collection.at(self.visible + 1).toJSON());
		        this.$('ul').append(str);
		        self.visible = self.visible + 2;
			}
	    	this.refreshScroll();
	    	this.watched();
	    },

	    videoScreen: function(e) {
	    	e.preventDefault();
	    	e.stopPropagation();
	    	var id		= $(e.currentTarget).closest('li').attr('data-id');
	    	var item	= this.collection.get(id);

	    	// add 'watched' icon
	    	// $(e.currentTarget).closest('li').find('.watched').show();
	    	// item.set('watched', '1');

	    	localStorage.setItem('tempVid', JSON.stringify(item));
	    	Backbone.history.navigate('video', true, true);
		},

		watched: function(){
			// var self = this;
			// var li = this.$('li');

			// for(var i=0; i<li.length; i++){
			// 	var id = self.$(li[i]).attr('data-id');
			// 	var wIcon = self.$(li[i]).find('.watched');
			// 	var item	= self.collection.get(id);
				
			// 	if(item.attributes.watched == '1'){
			// 		console.log('SHOW');
			// 		console.log(wIcon);
			// 		wIcon.show();
			// 	}
			// }
		}
	});

});
