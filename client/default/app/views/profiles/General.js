/*--------------------
	app/views/profile/General

	View for all user details
--------------------*/
define(['jquery',
    'iscroll',
    'underscore',
    'backbone',
    'models/User',
    'text!templates/pages/ProfileGeneral.html',
    'text!templates/popups/AddressBox.html',
    'text!templates/popups/PasswordBox.html',
    'text!templates/popups/AvatarSelect.html',
    'controllers/Profile',
    'models/Store'
    ], function($, iscroll, _, Backbone, User, template, addressBox, passwordBox, avatarBox, Controller, Store) {

	return Backbone.View.extend({
		// Backbone specific attributes
		tagName		: 'section',
	    id			: 'general',
	    controller 	: new Controller(),
	    user 		: new User(),
	    
		template: _.template(template),
        events : {
            'change #birthday'     : 'ageCalc',
            'click #address'       : 'showAddr',
            'click #AddrSave'      : 'closeAddr',
            'click #AddrCancel'    : 'closeAddr',
            'click #profile-avatar': "popup",
            'click #cancelBtn'     : 'closeAvatar',
            'click #saveBtn'       : 'closeAvatar',
            'click #password'      : 'password',
            'click #cancelPass'    : 'password',
            'click #okPass'        : 'password',
            'change input'         : 'validate',
            'click .avatarPic'     : 'pickAvatar',
            'keyup #phone'         : 'maskInput',
            'keyup #mobile'        : 'maskInput',
            'click #uploadBtn'     : 'uploadImage'
        },

		initialize: function(){
			var self = this;
            Store.load('peachy_avatars', function(res, data){
                if(res && data){
                    self.avatars = JSON.parse(data).avatars;    
                }
                else {
                    self.avatars = [];
                }
            });
            this.$el.html(this.template());
		},

		render: function(){
			var self = this;
            this.refreshScroll();
            this.populate();
            return this;
		},

		populate: function(){
            var details;
            var self = this;
            this.user.loadUser(function(res, data){
                if(res){
                    if(data){
                        details = data || {};
                        self.mapValues(details);
                    }
                }else{
                    alert('User Details Not Loaded');
                }
            });

            return details;
        },

        maskInput: function(e){
            var target = e.currentTarget;
            var value = $(target).val().replace('.', '');
            var length = value.length;

            if(length == 3 || length == 6){
                $(target).val($(target).val() + '.');
            }
        },

        saveDetails: function(){
            this.controller.saveProfile(this);
        },

		refreshScroll: function(){
			if(this.container){
				this.container.refreshScroll();  
			}
		},

		password: function(e){
            e.stopPropagation();
            if(e && e.currentTarget.id == 'cancelPass'){
                $('#passwordDiv').hide();
                $('#modalMask').hide();
            }
            else if(e && e.currentTarget.id == 'okPass'){
                var pass1 = $('#confirmPassword_txt').val();
                var pass2 = $('#confirmPassword_txt2').val();
                if(pass1 == pass2 && pass1 != ''){
                    Backbone.trigger('notify', 'Password Reset Functionality not added!');
                    $('#passwordDiv').hide();
                    $('#modalMask').hide();
                }
                else if(pass1 == ''){
                    Backbone.trigger('notify', 'Password can not be empty!', 'Password Error');
                }
                else { 
                    Backbone.trigger('notify', 'Passwords do not match!', 'Password Error');
                }
            }
            else {
                var box     = $(passwordBox);
                $('body').append(box);
                $('#passwordDiv').show();
                $('#modalMask').show();   
                $('#confirmPassword_txt').val("").focus();
                $('#confirmPassword_txt2').val("");
                this.fixEvents(box);
            }              
        },

        ageCalc: function(){
            var self = this;
            var dob = new Date(self.$('#birthday').val()) || new Date();
            var msg = this.$('#age');
            var today = new Date();

            var diff = today.getTime() - dob.getTime();
            var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

            if(age > 0){
                msg.html(age + ' years old');
            }
        },

        showAddr: function(e){
            e.stopPropagation();

            $('#addressBox').remove();
            var self 	= this;
            var target	= this.$('#address').find('div')[0];
            var text	= target.innerText;
            var box 	= $(addressBox);
            target.blur();

            $('#modalMask').show();
            $('body').append(box);
            box = $('#addressBox');
            box.fadeIn({}, 300 );
            var vals = text.split('\n');

            $('#line1').val(vals[0]);

            if(vals.length == 3){                
                $('#state').val(vals[1]);    
                $('#zip').val(vals[2]);
            }
            else {
                $('#line2').val(vals[1]);                
                $('#state').val(vals[2]);    
                $('#zip').val(vals[3]);
            }

            this.fixEvents(box);
        },

        closeAddr: function(e){
            var target  = e.currentTarget;
            var box     = $('#addressBox');
            if(target.id == 'AddrCancel'){
                box.fadeOut({}, 300);
                $('#modalMask').hide();
                return;
            }

            var line1	= $('#line1').val();
            var line2	= $('#line2').val();
            var zip		= $('#zip').val();
            var state	= $('#state').val();
            var text    = '';

            if(zip.length != 5 || isNaN(zip)){
                return Backbone.trigger('notify', 'Please enter a valid Zip (5 digits)');
            }
            else if(line1.length ==0 || state.length == 0){
                return Backbone.trigger('notify', 'Please fill in Address and State');
            }

            if(line2.length == 0){
                text = line1 + "\n" + state + "\n" + zip;    
            }
            else {
                text = line1 + "\n" + line2 + "\n" + state + "\n" + zip;    
            }
            
            this.$('div#address').val(text);
            this.$('div#address')[0].innerText = text;

            box.fadeOut(function(){
                $('#addressBox').remove();
                $('#modalMask').hide();
            }, 300);
            
        },

        mapValues: function(details){
            var self = this;
            var d    = details.userDetails;
            var d2   = details.providers;
            var d3   = details.linkedAccounts;

            // Map User Details Fields ---------------------------------
            // ---------------------------------------------------------
            if(d.address2 == undefined){
                var addr = d.address1 +'\n'+ d.state +'\n'+ d.zip;
            }
            else {
                var addr = d.address1 +'\n'+ d.address2 +'\n'+ d.state +'\n'+ d.zip;
            }

            this.$('#firstName').val(d.firstName);
            this.$('#middleName').val(d.middleName);
            this.$('#lastName').val(d.lastName);
            this.$('#firstName').val(d.firstName);
            this.$('#sex option[value="' + d.sex + '"]').attr('selected', 'selected');
            this.$('#firstName').val(d.firstName);
            this.$('#email').val(d.email);
            this.$('#birthday').val(d.dob);
            this.$('div#address')[0].innerText = addr;
            this.$('#phone').val(d.phone);
            this.$('#mobile').val(d.mobile);
            this.$('#username').val(d.username || self.user.name);
            this.$('input#password').val('12345678');
            avatar = d.avatarId;

            for(var i=0; i<self.avatars.length; i++){
                if(self.avatars[i].avatarId == d.avatarId){
                    self.$('#profile-avatar').attr('src', "data:image/png;base64,"+self.avatars[i].image64).attr('imgId', d.avatarId);
                }
            }
            this.avatarId = d.avatarId;
            // ----------------------------------------------------------

            // Map Providers Details ------------------------------------
            // ----------------------------------------------------------

            var box = this.$('#physicianBox');
            box.html('');

            for(var i=0; i<d2.length; i++){
                var item = d2[i];

                var html =  "<div id='physician'>"+
                                "<div id='name'>" + item.firstName + ' ' + item.lastName + "</div>"+
                                "<div id='job'>" + item.type + "</div>"+
                                "<div id='email'>" + item.emailAddress + "</div>"+
                                "<div id='phone'>" + item.officePhone + "</div>"+
                            "</div>";
                box.append(html);
            }
            // -----------------------------------------------------------

            // Map Linked Accounts Details ------------------------------
            // ----------------------------------------------------------

            var box = this.$('#linkedBox');
            box.html('');

            for(var i=0; i<d3.length; i++){
                var item = d3[i];
   
                var html =  "<div id='account'>"+
                                "<div id='name'>" + item.userDetails.firstName + ' ' + item.userDetails.lastName + "</div>"+
                                "<div id='job'>" + item.relationship +  "</div>"+
                                "<div id='email'>" + item.userDetails.email + "</div>"+
                                "<div id='phone'>" + item.userDetails.phone + "</div>"+
                            "</div>";
                box.append(html);
            }
            // -----------------------------------------------------------

            this.ageCalc();
        },

        popup: function(){
            var self = this;
            var box = avatarBox;
            var html;

            if(self.avatars.length == 0){
                self.initialize();
            }

            for(var i =0; i<self.avatars.length; i++){
                var src = "data:image/png;base64,"+self.avatars[i].image64;
                var imgId = self.avatars[i].avatarId;
                html += '<img class="avatarPic" imgId="' + imgId +'" src="'+src+'"/>';
            }

            this.$el.append(box);
            this.$('#avatarSelect').find('#pictureRoll').html(html);

            this.avatarScroll = new iscroll($('#middleSection')[0], {
                hScroll     : true,
                vScroll     : false,
                hScrollbar  : false
            });
            setTimeout(function(){
                self.avatarScroll.refresh();
            }, 100);
            
        },
    

        closeAvatar: function(e){
            var e = $(e.currentTarget);
            var id = e[0].id;
            
            if(id === 'cancelBtn'){
                $('#avatarSelect').remove();
                return;
            }
            var image = $('.avatarPic.selected');
            var imageId = image.attr('imgid');
            var imageSrc = image.attr('src');
  
            this.$('#profile-avatar').attr('src',imageSrc).attr('imgid', imageId);
            $('#avatar').attr('src', imageSrc);
            $('#avatarSelect').remove();
        },

        pickAvatar: function(e){
            $('.avatarPic').removeClass('selected');
            var e = $(e.currentTarget);
            e.addClass('selected');
        },

        validate: function(e){
            var target  = e.currentTarget;
            var id      = $(target).attr('id');
            var val     = $(target).val();

            if(id === 'email'){
                if(val.indexOf('@') == -1 || val.indexOf('.') == -1){
                    Backbone.trigger('notify', 'Please enter a valid email address');
                }
            }
            else if(id === 'phone'){
                num = val.replace(/\./g, '');
                if(num.length != 10 || isNaN(num)){
                    Backbone.trigger('notify', 'Please enter a valid phone number (10 digits)');
                }
            }
        },

        fixEvents: function(el){
            var self    = this;
            var id      = el.attr('id');

            el.find('.btn').click(function(e){
                if(id === 'addressBox'){
                    self.closeAddr(e);    
                }
                else {
                    self.password(e);
                }
                
            });
        },

        uploadImage: function(){
            console.log('Getting image');
            $('.avatarPic').removeClass('selected');

            var html = $('<img></img>');
            html.addClass('avatarPic').addClass('selected');
            html.attr('imgId', 'custom').attr('src', 'img/Maureen(Me)Avatar.png');
            $('#pictureRoll').prepend(html);

            this.avatarScroll.refresh();
        }
	});
});
