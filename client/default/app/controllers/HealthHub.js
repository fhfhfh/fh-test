/*--------------------
	app/controllers/HealthHub

	HealthHub page Controller
--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'models/healthHub'
    ], function($, _, Backbone, HealthHub) {

        //interface----------------------------------
        var quotes = {
            loadHealthHub 	: _loadHealthHub 
        };


        function _loadHealthHub(callback){
              HealthHub.fetchHealthHub(function(err, res){
                if(res){
                  return callback(null,res);
                }
                else
                    {
                         return callback(err,null);
                    }
                
                
                });
           

        }
	

        return quotes;

    });