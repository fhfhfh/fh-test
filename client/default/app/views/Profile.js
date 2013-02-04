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
    'controllers/Profile',
    'models/Store'
    ], function($, _, Backbone, Acts, User, template, addressBox, Controller, Store) {

        //interface ---------------------------
        var profile = Backbone.View.extend({

            // Backbone specific attributes
            tagName	: 'section',
            id		: 'profile',
            template: _.template(template),
            events : {
                'change #birthday'     : 'ageCalc',
                'click #address'       : 'showAddr',
                'click #done'          : 'closeAddr',
                'click #profile-avatar': "popup",
                'click #cancelpop'     :'popup',
                'change #password'     : 'password',
                'click #cancelPass'    :'password',
                'click #okPass'        :'ok',

                'click #closeAvatar'   : 'closeAvatar',
                'click .avatarPic'     : 'pickAvatar'
            },

            //Function interface
            initialize	: _initialize,
            render		: _render,		// return template
            populate 	: _populate, 	// Populate all detail fields
            saveDetails : _saveDetails,	// Save details to user model
            cancel 		: _cancel,
            popup               : _popup,		// navigate back to home page
            ageCalc     : _ageCalc,     // Calculate age of user based on DOB field
            showAddr    : _showAddr,   // Pop-up box to show all address fields
            closeAddr 	: _closeAddr,
            mapValues 	: _mapValues,
            setAvatar           : _setAvatar,
            password    : _password,
            ok          : _ok,
            closeAvatar : _closeAvatar,
            pickAvatar  : _pickAvatar
        });


        //implementation-------------------------------

        var user       = new User();
        var controller = new Controller();
        var selected   ="";
        var avatar;

        function _initialize(){
            var self = this;
            Store.load('peachy_avatars', function(res, data){
                self.avatars = JSON.parse(data).avatars;
            });
        };

        function _render(){
            var self = this;
            this.$el.html(this.template());
            // this.setAvatar();
            this.populate();
            return this;
        };

        function _populate(){
            var details;
            var self = this;
            user.loadUser(function(res, data){
                if(res){
                    if(data){
					
                        details = data.userDetails || {};
                        self.mapValues(details);
                    }
                }else{
                    alert('TODO: error handling');
                }
            });

            return details;
        };

        function _saveDetails(){
            controller.saveProfile(this);
        };
        
        function _password(){ 
            var passwordDiv = $('#passwordDiv');
             $('#confirmPassword_txt').val("");
              $('#pass_mess').hide();
            if(passwordDiv.css("display")=="block") {
                    
                passwordDiv.hide();
                 $('#cover_div').hide();
            }
            else {
                $('#cover_div').show();
                passwordDiv.show();
            }
            
        };
        
        function _ok(){ 
            var pass1;
            var pass2;
            pass1 = $('#password').val();
            pass2 = $('#confirmPassword_txt').val();
            if(pass1 == pass2)
            {
              $('#passwordDiv').hide();
               $('#cover_div').hide();
       }
            else
                { 
                    $('#password').val(pass1);
                    $('#confirmPassword_txt').val("");
                    $('#pass_mess').show();
                    $('#confirmPassword_txt').focus(function(){
                        $('#pass_mess').hide();
                        
                    });
            }
                
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
            var target	= this.$('#address').find('div')[0];
            var text	= target.innerText;
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
        };

        function _closeAddr(){
            var box		= this.$('#addressBox');
            var line1	= this.$('#line1').val();
            var line2	= this.$('#line2').val();
            var zip		= this.$('#zip').val();
            var state	= this.$('#state').val();

            var text = line1 + "\n" + line2 + "\n" + zip + "\n" + state;
            this.$('div#address').val(text);
            this.$('div#address')[0].innerText = text;

            box.fadeOut({}, 300);
        };

        function _mapValues(details){
            var self = this;
            var d = details;

            // TODO: remove once Steve has updated numbers in db
            d.phone = d.phone.replace('.', '');
            d.mobile = d.mobile.replace('.', '');

            this.$('#firstName').val(d.firstName);
            this.$('#middleName').val(d.middleName);
            this.$('#lastName').val(d.lastName);
            this.$('#firstName').val(d.firstName);
            this.$('#sex option[value="' + d.sex + '"]').attr('selected', 'selected');
            this.$('#firstName').val(d.firstName);
            this.$('#email').val(d.email);
            this.$('#birthday').val(d.dob);
            this.$('div#address')[0].innerText = d.address1 +'\n'+ d.address2 +'\n'+ d.zip +'\n'+ d.state;
            this.$('#phone').val(d.phone);
            this.$('#mobile').val(d.mobile);
            this.$('#username').val(d.username || user.name);


            
            avatar = d.avatarId;

            for(var i=0; i<self.avatars.length; i++){
                if(self.avatars[i].avatarId == d.avatarId){
                    self.$('#profile-avatar').attr('src', self.avatars[i].imageUrl).attr('imgId', d.avatarId);
                }
            }
            this.avatarId = d.avatarId;
            this.ageCalc();
        };

        function _popup(){
            var self = this;
            var box = $('<div id="avatarSelect"></div>');
            var html = '<h1>Select an Avatar</h1>';

            for(var i =0; i<self.avatars.length; i++){
                var src = self.avatars[i].imageUrl;
                var imgId = self.avatars[i].avatarId;
                html += '<img class="avatarPic" imgId="' + imgId +'" src="'+src+'"/>';
            }
            html += '<br/><li id="closeAvatar" class="decline btn">Cancel</li>';
            box.html(html);

            $('#profile').append(box);
        }
    
    
        // function _popup(){
        //     var popupDiv = $('#PopupDiv');
        //     $('#PopupDiv').html("");
        //     popupDiv.append("<h1 align='center'>Select Avatar Image</h1>");
        //     popupDiv.append("<div id='popup_inner_div' style='padding : 2%'></div>");
        //     $('#PopupDiv #popup_inner_div').append("<ul id='popup_ul'>"); 
        //     for (i=0; i<imgUrl.avatars.length; i++)
        //     {
        //         var abc = imgUrl.avatars[i].imageUrl;
        //         var xyz = imgUrl.avatars[i].avatarId;
        //         var tempurl = abc.replace('"', "");
        //         var tempurl = tempurl.replace('"', "");
        //         $('#PopupDiv #popup_inner_div #popup_ul').append("<li style=' margin: 10px 20px 20px 20px' id='popup_li"+i+"'></li>");
        //         $('#PopupDiv #popup_inner_div #popup_li'+i).append("<img id='img"+i+"'class'popup_avatar' alt='"+xyz+"' style='height : 75px' id='theImg' src='"+tempurl+"'/>");
        //         $('#PopupDiv #popup_inner_div #popup_li'+i+" img").click(function(){
        //             selected = $(this).attr("alt");
        //             popupDiv.hide();
        //             $('#cover_div').hide();
        //             popbtn(selected);
        //         // text.innerHTML = "show";
        //         });
        //     }
        //     popupDiv.append("<button id='cancelpop' class='pop_btn'>Cancel</button></li>");
        //     if(popupDiv.css("display")=="block") {
                    
        //         popupDiv.hide();
        //          $('#cover_div').hide();
        //     // text.innerHTML = "show";
        //     }
        //     else {
        //         popupDiv.show();
        //          $('#cover_div').show();
        //     // text.innerHTML = "hide";
        //     }
            
        // }
        
        
        // function popbtn(item) {
        //     var avatarJson= {
        //         avatarId : item
        //     }
        //     for (i=0; i<imgUrl.avatars.length; i++)
        //     {   
        //         if(imgUrl.avatars[i].avatarId == item)
        //         {
        //             var abc = imgUrl.avatars[i].imageUrl;
        //             var tempurl = abc.replace('"', "");
        //             var tempurl = tempurl.replace('"', "");
        //             this.$('#avatar').attr("src", tempurl);
        //             this.$('#account-information').find('img').attr("src", tempurl);
        //             avatar_id = item
        //         }
        //     }
        // }


        function _setAvatar() {
            
            controller1.loadAvatars(function(url){
               // 
                if(imgUrl == "")
                {
                    for (i=0; i<url.avatars.length; i++)
                    {
                        if(url.avatars[i].avatarId == avatar_id)
                        {
                            var abc = url.avatars[i].imageUrl;
                            var tempurl = abc.replace('"', "");
                            var tempurl = tempurl.replace('"', "");
                            this.$('#avatar').attr("src", tempurl);
                            this.$('#account-information').find('img').attr("src", tempurl);
                            imgUrl = url;
                            selected = avatar;
                        }
                    }
                }else{
                    for (i=0; i<url.avatars.length; i++)
                    {   
                        if(url.avatars[i].avatarId == selected)
                        {
                            var abc = imgUrl.avatars[i].imageUrl;
                            var tempurl = abc.replace('"', "");
                            var tempurl = tempurl.replace('"', "");
                            this.$('#avatar').attr("src", tempurl);
                            this.$('#account-information').find('img').attr("src", tempurl);
                
                        }
                    }
                }
                
            });
        };

        function _closeAvatar(){
            $('#avatarSelect').remove();
        };

        function _pickAvatar(e){
            var e = $(e.currentTarget);
            var id = e.attr('imgId');
            var src = e.attr('src');

            this.$('#profile-avatar').attr('src',src).attr('imgId', id);
            $('#avatar').attr('src', src);
            $('#avatarSelect').remove();
        }

        return profile;

    });
