/*--------------------
	app/views/Profile

	View for all user details
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'models/Acts',
        'models/User',
        'text!templates/pages/Profile.html',
        'text!templates/components/AddressBox.html',
        'controllers/Profile'
], function($, _, Backbone, Acts, User, template, addressBox, Controller) {

	//interface ---------------------------
	var profile = Backbone.View.extend({

		// Backbone specific attributes
		tagName	: 'section',
	    id		: 'profile',
	    template: _.template(template),
	    events : {
	    	'change #birthday': 'ageCalc',
            'click #address': 'showAddr',
            'click #done' : 'closeAddr'
	    },

	    //Function interface
		initialize	: _initialize,
		render		: _render,		// return template
		populate 	: _populate, 	// Populate all detail fields
		saveDetails : _saveDetails,	// Save details to user model
		cancel 		: _cancel,		// navigate back to home page
		ageCalc     : _ageCalc,     // Calculate age of user based on DOB field
        showAddr    : _showAddr,   // Pop-up box to show all address fields
        closeAddr 	: _closeAddr
	});


	//implementation-------------------------------
	var user		= new User();
	var controller	= new Controller();

	function _initialize(){
		this.render();
	};

	function _render(){
		var self = this;
		var details = this.populate();
		this.$el.html(this.template(details));

		return this;
	};

	function _populate(){
		var details;

		user.loadUser(function(res, data){
			if(res){
				details = data.userDetails;
			}else{
				alert('TODO: error handling');
			}
		});

		return details;
	};

	function _saveDetails(){
		controller.saveProfile(this);
		console.log('Saving...');
	};

	function _cancel(){
		Backbone.history.navigate('home', true);
	};

	function _ageCalc(){
        var self = this;
        var dob = new Date(self.$('#birthday').val()) || new Date();
        var msg = this.$('#age');
        var today = new Date();

        var diff = today.getTime() - dob.getTime();
        var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

        if(age > 0){
            msg.html(age + ' years old');
        }
    };

    function _showAddr(){
    	var self 	= this;
        var target	= this.$('#address');
        var text	= target.val();
        var box 	= $(addressBox);
        target.blur();

        this.$el.append(box);

        box = this.$('#addressBox');

        box.fadeIn({}, 300 );

        var vals = text.split('\n');

        this.$('#line1').val(vals[0]);
        this.$('#line2').val(vals[1]);
        this.$('#zip').val(vals[2]);
        this.$('#state').val(vals[3]);

        console.log('pop');
    };

    function _closeAddr(){
    	var box		= this.$('#addressBox');
    	var line1	= this.$('#line1').val();
        var line2	= this.$('#line2').val();
        var zip		= this.$('#zip').val();
        var state	= this.$('#state').val();

        var text = line1 + "\n" + line2 + "\n" + zip + "\n" + state;
        this.$('#address').val(text);

    	box.fadeOut({}, 300);
    }



	return profile;

});
