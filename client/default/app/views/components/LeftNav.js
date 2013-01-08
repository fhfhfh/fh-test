/**
 * Backbone view for the LeftNav area of the screen
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/LeftNav.html'
], function($, _, Backbone, tpl) {

    return Backbone.View.extend({
        tagName: 'section',
        id: 'navbar',
        el: '#leftNav',

        events: {
            'click li': 'switchTab'
        },

        initialize: function() {
            _.bindAll(this);
            this.render();
        },

        render: function() {
            this.$el.html(tpl);

            return this.$el;
        },

        show: function(){
            this.$el.show();
        },
        hide: function(){
            this.$el.hide();
        },

        switchTab: function(e){
            var element = $(e.target).closest('li');
            var id = element[0].id;

            this.$el.find('li').removeClass('selected');
            element.addClass('selected');

            appRouter.navigate(id, true);
        },

    });
});
