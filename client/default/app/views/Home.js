window.HomeView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Home View');
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];
    },

    events:{
        "click .btn":"test"
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },

    test:function () {
        console.log('TEST');
    }

});