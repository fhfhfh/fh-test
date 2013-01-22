/*--------------------
	app/controllers/Avatars

	Avatars page Controller
--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'models/avatars'
    ], function($, _, Backbone, Avatars) {

        //interface----------------------------------
        var avatars = {
            loadAvatars 	: _loadAvatars
        };


        function _loadAvatars(cb){
            Avatars.fetchAvatars(function(res, data){
                return cb(res.payload);   

            });
                        

        }
	

        return avatars;

    });