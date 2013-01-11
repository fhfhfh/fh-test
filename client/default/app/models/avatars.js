/*--------------------
	app/models/Avatars

	Avatars model
--------------------*/
define(['zepto',
    'underscore',
    'backbone',
    //'models/Store',
    'models/Acts'
    ], function($, _, Backbone, Acts) {

        //interface----------------------------------
        var avatars = {
            //Backbone specific attributes
		
            fetchAvatars  : _fetchAvatars
        }
	
        //scripts------------------------------------


        //implementation-------------------------------

	
        function _fetchAvatars(callback){
            // fetch Avatars profile from cloud
            Acts.call('fetchAvatarsAction', {}, 
                function(res){
                    return callback(res);
                    
                }, function(err, msg){
                    console.log(err);
                }
                );
        };

        return avatars;

    });