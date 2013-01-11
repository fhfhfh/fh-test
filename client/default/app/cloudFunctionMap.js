// Used to map cloud function names to their
// relevant payload names, as per JSON request/response spec

define(['jquery',
        'underscore',
        'backbone',
        'models/Acts'
], function($, _, Backbone, Acts) {


	// TODO -- complete map for all cloud functions
	var map = {
		'loginAction' : 'login',
		'logoutAction': 'logout',
		'userProfileAction' : 'userProfile'
	};

	return map;

});
