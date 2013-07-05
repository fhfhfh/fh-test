/*------------------
app/models/ActivityItem

Model for Activity items
--------------------------*/

define(['backbone'], function(Backbone) {


    var item = Backbone.Model.extend({

        defaults: {
            favorite        : false,
            recent          : false,
            notes           : ""
        },

        initialize: function(){
        }

    });


    return item;
});