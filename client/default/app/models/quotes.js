/*--------------------
	app/models/Quotes

	Quotes model
--------------------*/
define(['zepto',
        'underscore',
        'backbone',
        //'models/Store',
        'models/Acts'
], function($, _, Backbone, Acts) {

	//interface----------------------------------
	var quotes = {
		//Backbone specific attributes
		
		fetchQuotes  : _fetchQuotes
	}
	
	//scripts------------------------------------


	//implementation-------------------------------

	
	function _fetchQuotes(callback){
            
           // alert("model");
		// fetch Quotes profile from cloud
		Acts.call('fetchQuotesAction', {}, 
                function(res){
                 return callback(res);
                    
                }, function(err, msg){
                    console.log(err);
                    
                }
                );
	};

	return quotes;

});