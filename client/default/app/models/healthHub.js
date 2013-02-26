/*--------------------
	app/models/HealthHub

	HealthHub model
--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    //'models/Store',
    'models/Acts'
    ], function($, _, Backbone, Acts) {

        //interface----------------------------------
        var healthHub = {
            //Backbone specific attributes
		
            fetchHealthHub  : _fetchHealthHub
        }
	
        //implementation-------------------------------

	
        function _fetchHealthHub(callback){
            // fetch HealthHub  from cloud
            Acts.call('healthHubAction', {}, 
                function(res){
                    return callback(null,res);
                    
                }, function(err, msg){
                    console.log(err,null);
                }
                );
        };

        return healthHub;

    });