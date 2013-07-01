/*--------------------
	app/models/Quotes

	Quotes model
--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    //'models/Store',
    'models/Acts'
    ], function($, _, Backbone, Acts) {

        //interface----------------------------------
        var quotes = {
            //Backbone specific attributes
            fetchQuotes  : _fetchQuotes
        };
        //scripts------------------------------------


        //implementation-------------------------------

        function _fetchQuotes(callback){
            // fetch Quotes profile from cloud
            Acts.call('fetchQuotesAction', {},
                function(res){
                   return callback(res);

                }, function(err, msg){
                    alert("error "+JSON.stringify(msg));
                    console.log(err);
                }
                );
        }

        return quotes;

    });