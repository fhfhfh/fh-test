/*--------------------
	app/controllers/Main

	Handle all 
--------------------*/
define(['jquery',
        'underscore',
        'models/User',
        'controllers/avatars',
        'controllers/HealthHub',
        'collections/Library',
        'collections/Folders'
], function($, _, User, Avatars, HealthHub, libStore, folders) {

	// initialise models etc...


	var ctr = {

		fetchAll : function(){
			Avatars.loadAvatars(function(){});
			HealthHub.loadHealthHub(function(){});
			libStore.fetch();
			folders.fetch();
		}
	}

	return ctr;
});
