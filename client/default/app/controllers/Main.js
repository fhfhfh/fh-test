/*--------------------
	app/controllers/Main

	Handle all 
--------------------*/
define(['jquery',
        'underscore',
        'models/User',
        'controllers/avatars',
], function($, _, User, Avatars) {

	var ctr = {

		fetchAll : function(){
			Avatars.loadAvatars(function(){});
		}
	}

	return ctr;
});
