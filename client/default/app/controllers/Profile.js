/*--------------------
	app/controllers/Profile

	Profile page Controller
--------------------*/
define(['zepto',
    'underscore',
    'backbone',
    'models/Acts',
    'models/User'
    ], function($, _, Backbone, Acts, User) {

        //interface----------------------------------
        var profile = Backbone.Model.extend({

            saveProfile 	: _saveProfile,
            loadProfile 	: _loadProfile
        });


        //implementation-------------------------------
        var user = new User();

        function _saveProfile(view, callback){
            var el = view.$el;
            var profile, details; // used to store the unchaged user info

            // all input values from view
            var inputs = {
                firstName	: el.find('#firstName').val(),
                middleName	: el.find('#middleName').val(),
                lastName	: el.find('#lastName').val(),
                sex		: el.find('#sex').val(),
                email		: el.find('#email').val(),
                birthday	: el.find('#birthday').val(),
                address		: el.find('#address').val(),

                phone		: el.find('#phone').val(),
                mobile		: el.find('#mobile').val()
            };

            var prof = user.loadUser(function(res, data){
                if(res){
                    profile = data || {};
                    profile.userDetails = inputs;
				
                    user.setProfile(profile);
                    user.saveUser(function(res){
                        if(res){
                            return callback(true);
                        } else {
                            return callback(false);
                        }
                    }); 
                }
            });

        // TODO: save profile to user model and local storage
        };

        function _loadProfile(view){
            var el = view.$el;
            var profile;
            var phy;

            user.loadUser(function(res, data){
                if(res){
                    if(data && data !=null){
                        profile = data.userDetails || {};
                        phy = data.providers || {};
                    }
                }
            });
           
            if(profile){
                el.find('#firstName').val(profile.firstName);
                el.find('#middleName').val(profile.middleName);
                el.find('#lastName').val(profile.lastName);
                el.find('#sex option[value='+profile.sex+']').attr('selected', 'selected');
                el.find('#email').val(profile.email);
                el.find('#birthday').val(profile.dob);
                el.find('#address').val(profile.address1);
                el.find('#homephone').val(profile.phone);
                el.find('#mobile').val(profile.mobile);
            }
            if(phy){
                el.find('#physician').find('#name').html(phy[0].firstName+" "+phy[0].lastName);
                el.find('#physician').find('#job').html(phy[0].speciality);
                el.find('#physician').find('#email').html(phy[0].emailAddress);
                el.find('#physician').find('#phone').html(phy[0].officePhone);
               
            }

        }
	

        return profile;

    });