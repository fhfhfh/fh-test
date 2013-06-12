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
            loadHealthHub	: _loadHealthHub
        };


        function _loadHealthHub(callback){
            HealthHub.fetchHealthHub(function(err, res){
                if(res){
                    var str = JSON.stringify(res.payload);
                    Store.save('peachy_healthHub', str, function(){
                        return callback(null,res);
                    });
                }
                else{
                    Backbone.trigger('notify', 'Error getting Health Hub data', 'Cloud Call error');
                    return callback(err,null);
                }
            });
        }

        return healthHub;

    });