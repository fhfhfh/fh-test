/**
 * Backbone view for the Add to Favorites Popup
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/popups/AddFavorite.html',
    'text!templates/components/AddFavoriteRow.html',
    'collections/Library',
    'collections/Folders'
], function($, _, Backbone, tpl, rowTpl, libStore, folderStore) {

    return Backbone.View.extend({
        tagName: 'section',
        id: 'addFavorite',
        template: _.template(tpl),
        collection: libStore,

        events: {
            'keyup #create': 'addTick',
            'click label'  : 'toggleFolder',
            'click #cancel': 'cancel',
            'click #save'  : 'save'
        },

        initialize: function() {
            _.bindAll(this);
            
            // this.item is the media going to be added to a folder
            this.item = this.options.item;

            this.folders = folderStore.models;
        },

        render: function() {
            var itemStr = this.populate();

            this.$el.html(this.template({list:itemStr}));
            return this.$el;
        },

        populate: function(){
            var folders = this.folders;
            var row = _.template(rowTpl);
            var rowStr = '';

            for(var i=0; i<folders.length; i++){
                var item = folders[i].attributes;
                rowStr+=row({id:item.id, title:item.name });
            }
            return rowStr;
        },

        show: function(){
            $('#modalMask').show();
            this.$('.popup').show();
        },
        hide: function(){
            $('#modalMask').hide();
            this.$('.popup').hide();
        },

        addTick: function(){
            var val = this.$('#create').val();

            if(val.length > 0){
                this.$('#createImg').show();
            } else {
                this.$('#createImg').hide();
            }
        },

        toggleFolder: function(e){
            var target  = e.currentTarget;
            $(target).toggleClass('checked');
        },

        cancel: function(){
            this.hide();
            this.remove();
        },

        save: function(){
            var item = '';
            var picked = $('label.checked');
            var names = [];

            for(var i=0; i<picked.length; i++){
                var folder =$(picked[i]);
                names.push(folder.text().toLowerCase().replace(/\s/g, ''));
            }

            if(this.$('#create').val().length >0){
                var name = this.$('#create').val();
                names.push(name.toLowerCase().replace(/\s/g, ''));
                folderStore.addFolder(name);
            }
            console.log(names);
        }

    });
});
