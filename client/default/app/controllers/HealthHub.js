/*--------------------
	app/controllers/HealthHub

	HealthHub page Controller
--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'models/healthHub',
    'models/Store'
    ], function($, _, Backbone, HealthHub, Store) {

        //interface----------------------------------
        var healthHub = {
            loadHealthHub 	: _loadHealthHub 
        };


        function _loadHealthHub(callback){
            HealthHub.fetchHealthHub(function(err, res){
                if(res){
                    Store.save('peachy_healthHub', res, function(){
                        return callback(null,res);    
                    });                    
                }
                else{
                    return callback(err,null);
                }
            });
        }

        return healthHub;

    });