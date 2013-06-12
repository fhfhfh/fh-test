/*--------------------
	app/controllers/Quotes

	Quotes page Controller
--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'models/quotes'
    ], function($, _, Backbone, Quotes) {

        //interface----------------------------------
        var quotes = {
            loadQuotes	: _loadQuotes
        };


        function _loadQuotes(callback){
            Quotes.fetchQuotes(function(res, data){
                if(res){
                    return callback(res);
                }
            });
        }

        return quotes;

    });