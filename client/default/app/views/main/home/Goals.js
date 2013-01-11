/*--------------------
    app/views/Goals

    View containing user goals
--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/Goals.html',
        'text!templates/components/GoalsDetails.html'
], function($, _, Backbone, template, detailsTpl) {

    //interface--------------------------------------
    var goals = Backbone.View.extend({

        // Backbone specific attributes
        tagName        : 'section',
        id            : 'goals',
        events        : {
            'click #add-goal' : 'addGoal',
            'click .piece' : 'goalDetails',
            'click #backBtn' : 'render'
        },
        goals: null,
        template    : _.template(template),

        //Function interface
        initialize    : _initialize,
        render        : _render,        // return template
        addGoal     : _addGoal,
        goalDetails: _goalDetails,
        populateGoalInfo: _populateGoalInfo

    });


    //implementation-------------------------------

    function _initialize(){
        _.bindAll(this);
    };

    function _render(){
        this.$el.html(template);
        this.populateGoalInfo();
        return this;
    };

    function _addGoal(){
        // TODO: need flats from customer
    };

    // Fetch all goal data from model/collection
    function _populateGoalInfo(){
        // TODO: create Goal model/collection

        //dummy data obj ----------------------------------
        var data = [
            {title: "Activities", data: "Dummy information..."},
            {title: "Weight", data: "Dummy information..."},
            {title: "Stress", data: "Dummy information..."},
            {title: "Eating", data: "Dummy information..."},
            {title: "Happiness", data: "Dummy information..."},
            {title: "Cholesterol", data: "Dummy information..."},
            {title: "Informed", data: "Dummy information..."},
            {title: "Smoking", data: "Dummy information..."},
            {title: "Habits", data: "Dummy information..."},
            {title: "Diabetes", data: "Dummy information..."},
            {title: "Blood Pressure", data: "Dummy information..."},
            {title: "Rest", data: "Dummy information..."}
            ];
            //----------------------------------

        var pieceArr = this.$('.piece');

        for(var i=0; i< data.length; i++){
            var index = i;
            var obj = data[i];
            var div = $(pieceArr[i]);
            $(div).html(obj.title).attr('info', obj.data);
        }

    };


    // Change html to show Goals detail page template
    // populated with
    function _goalDetails(e){
        var target = e.currentTarget;
        console.log('goal clicked', target);
        var page = $(this.el);

        var details = _.template(detailsTpl);
        var info = $(target).attr('info');

        this.$el.html(details({
            title: target.innerHTML,
            info: info
        }));
    }


    return goals;

});