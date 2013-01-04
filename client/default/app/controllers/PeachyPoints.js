/*--------------------
	app/controllers/PeachyPoints

	PeachyPoints page Controller
--------------------*/
define(['zepto',
    'underscore',
    'backbone',
    'models/Acts',
    'models/PeachyPoints'
    ], function($, _, Backbone, Acts, PeachyPoints) {

//interface----------------------------------
        var points = Backbone.Model.extend({

            loadPoints 	: _loadPoints
        });


        //implementation-------------------------------
        var peachyPoints = new PeachyPoints();

        function _loadPoints(view){
            alert("-------------------loadPOints Controller");
            var el = view.$el;
//            var profile;
//            var phy;

            peachyPoints.fetchPoints(function(res){
                if(res){
                   alert(res);
                   console.log("/n/n*********"+res);
                   // el.find('#points-button').val(profile.firstName);
                    }
                   });
           
        }
        return points;
        
    });