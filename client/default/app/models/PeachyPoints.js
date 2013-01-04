/*--------------------
	app/models/PeachyPoints

	PeachyPoints model
--------------------*/
define(['zepto',
    'underscore',
    'backbone',
    'models/Store',
    'models/Acts'
    ], function($, _, Backbone, store, Acts) {

        //interface----------------------------------
        var user = Backbone.Model.extend({
            //Backbone specific attributes
		
            points : null,
            //		loadPoints   : _loadPoints,
            fetchPoints  : _fetchPoints
        });
	
        //scripts------------------------------------


        function _fetchPoints(callback){
            var self = this;
            // fetch user profile from cloud
            Acts.call('peachyPointsAction', {}, 
                function(res){
                    return callback(res);
                }, function(err, msg){
                    console.log(err);
                }
                );
        };

        return user;

    });