/*--------------------
	app/models/Notifications

	Module used to create overlayed notifications
--------------------*/
define(['zepto',
        'underscore',
        'backbone'
], function($, _, Backbone) {

	// interface --------------------------------------
	var notifications = {

		msg : _msg 		// set Message to be written to screen

	};


	// implementation --------------------------------------

	function _msg(text, time){
		var body = $('body');
		var note = $("<div id='notification'/>");
		var time = time || 3000;
		note.html(text);

		body.append(note);

		setTimeout(function(){
			// note.fadeOut("slow", function () {
			// 	note.remove();
			// });
			note.remove();
		}, time);
	}

	return notifications;
});