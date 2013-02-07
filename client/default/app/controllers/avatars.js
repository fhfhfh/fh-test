/*--------------------
	app/controllers/Avatars

	Avatars page Controller
--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'models/avatars',
    'models/Store'
    ], function($, _, Backbone, Avatars, Store) {

        //interface----------------------------------
        var avatars = {
            loadAvatars 	: _loadAvatars
        };


        function _loadAvatars(cb){
            Avatars.fetchAvatars(function(res, data){
                console.log('start');
                // Store avatars to local Storage.
                var data = JSON.stringify(res.payload);
                console.log('store');
                Store.save('peachy_avatars', data, function(){
                    console.log('end');
                    return cb(res.payload);
                })
                

            });
                        

        }
	

        return avatars;

    });