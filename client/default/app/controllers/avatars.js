/*--------------------
	app/controllers/Avatars

	Avatars page Controller
--------------------*/
define(['zepto',
    'underscore',
    'backbone',
    'models/avatars'
    ], function($, _, Backbone, Avatars) {

        //interface----------------------------------
        var avatars = {
            loadAvatars 	: _loadAvatars
        };


        function _loadAvatars(cb){
          //  var el = view.$el;
            Avatars.fetchAvatars(function(res, data){
//                if(res){
                     return cb(JSON.stringify(res.payload.avatars[1].imageUrl));   
//                     el.find('#avatar').src = "http://99.71.210.208:8888/PeachyWebApi/Images/02_0001_DarkFemale.png";
//                   ealert(JSON.stringify(res.payload.avatars[1].imageUrl));   
//                     el.find('#points-button em').html(222222);
//                   el.find('#avatar').src.html(JSON.stringify(res.payload.avatars[1].imageUrl));
                                   
//                }
            });
                        

        }
	

        return avatars;

    });