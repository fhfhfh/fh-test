/*--------------------
	app/controllers/Main

	Handle all 
--------------------*/
define(['jquery',
        'underscore',
        'models/User',
        'controllers/avatars',
        'models/Vitals',
        'models/Allergies',
        'models/Encounters',
        'models/FamilyHistory',
        'models/Immunizations',
        'models/Problems',
        'models/Procedures',
        'models/SocialHistory',
        'controllers/HealthHub'
], function($, _, User, Avatars, Vitals, Allergies, Encounters, FamilyHistory, Immunizations, Problems, Procedures, SocialHistory, HealthHub) {

	// initialise models etc...
	var vitals			= new Vitals();
	var allergies		= new Allergies();
	var encounters		= new Encounters();
	var fHistory		= new FamilyHistory();
	var immunizations	= new Immunizations();
	var problems		= new Problems();
	var procedures		= new Procedures();
	var sHistory		= new SocialHistory();




	var ctr = {

		fetchAll : function(){
			Avatars.loadAvatars(function(){});
			HealthHub.loadHealthHub(function(){});
			// vitals.fetch();
			// allergies.fetch();
			// encounters.fetch();
			// fHistory.fetch();
			// immunizations.fetch();
			// problems.fetch();
			// procedures.fetch();
			// sHistory.fetch();

		}
	}

	return ctr;
});
