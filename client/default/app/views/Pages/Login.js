LoginView = Backbone.View.extend({

	className: 'login-page',

    initialize:function () {
        console.log('Initializing Home View');
		this.template = _.template(tpl.get('Login'));
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