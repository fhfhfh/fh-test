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
        'collections/Folders',
        'collections/FoodJournal'
], function($, _, User, Avatars, HealthHub, libStore, folders, journal) {

	// initialise models etc...


	var ctr = {

		fetchAll : function(){

            setTimeout(function(){
                Avatars.loadAvatars(function(){});
            }, 2000);

            HealthHub.loadHealthHub(function(){});
            libStore.fetch();
			folders.fetch();
            journal.load();
		}
	};

	return ctr;
});
