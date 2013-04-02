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
            loadAvatars 	: _loadAvatars,
            getAvatars      : _getAvatars,
            getAvatarById   : _getAvatarById,
            getUserAvatar   : _getUserAvatar
        };


        function _loadAvatars(cb){
            Avatars.fetchAvatars(function(res, data){
                // Store avatars to local Storage.
                var data = JSON.stringify(res.payload);
                Store.save('peachy_avatars', data, function(){
                    return cb(res.payload);
                })
            });                        
        };

        function _getAvatars(){
            Store.load('peachy_avatars', function(res, data){
                if(res && data){
                    console.log('data', data);
                    var obj = JSON.parse(data);
                    return obj.avatars;
                }
            })
        };

        function _getAvatarById(id){
            var item;
            Store.load('peachy_avatars', function(res, data){
                if(res && data){
                    var obj = JSON.parse(data);
                    var array = obj.avatars;
                    
                    for(var i=0;i<array.length;i++){
                         item = array[i];
                    
                        if(item.avatarId == id){
                            return item;
                        }
                    }
                }
            });
            return item;
        };

        function _getUserAvatar(){
            var self = this;
            var avatar;
            Store.load('userProfile', function(res, data){
                if(res && data){
                    var obj = JSON.parse(data);
                    var id = obj.userDetails.avatarId;
                    avatar = self.getAvatarById(id);   
                }
            });
            return avatar;
        }
	

        return avatars;

    });