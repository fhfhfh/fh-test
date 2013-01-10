/*--------------------
	app/controllers/Quotes

	Quotes page Controller
--------------------*/
define(['zepto',
    'underscore',
    'backbone',
    'models/quotes'
    ], function($, _, Backbone, Quotes) {

        //interface----------------------------------
        var quotes = {
            loadQuotes 	: _loadQuotes 
        };


        function _loadQuotes(view){
            var el = view.$el;
            Quotes.fetchQuotes(function(res, data){
                if(res){
                    var i =Math.floor(Math.random()*3);
                    
                    el.find('#loading-snippet #first').html(JSON.stringify(res.payload.quotes[i].quote));
                    el.find('#loading-snippet #second').html(JSON.stringify(res.payload.quotes[i].author));
                
                }
            });

        }
	

        return quotes;

    });