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
        id: 'addFavoriteContainer',
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
            this.item = this.options;
            this.folders = folderStore.models;
        },

        render: function() {
            var self=this;
            var itemStr = this.populate();

            this.$el.html(this.template({list:itemStr}));
            this.iscroll = new iScroll(this.$('#wrapper')[0], {
                vScrollbar: false,
                bounceLock: true
            });
            self.iscroll.refresh();
            this.checkModel();

            return this.$el;
        },

        inFavs: function(){
            var self=this;
            var itemModel = this.collection.get(self.item.id);
            if(!itemModel){
                return false;
            }
            return true;
        },

        checkModel: function(){
            var self=this;
            var i;
            var itemModel = this.collection.get(self.item.id);

            // check if model exists as a LibraryItem, if not, create it
            if(!itemModel){
                this.collection.addAsset(self.item);
            } else {
                console.log('model exists');
                var checked =itemModel.get('folders');
                console.log(checked);
                for(i=0; i<checked.length;i++){
                    this.$('label[for="' + checked[i]+'"]').addClass('checked');
                }
            }
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
            this.iscroll.refresh();
        },
        hide: function(){
            $('#modalMask').hide();
            this.$('.popup').remove();
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
            e.stopPropagation();
            var target  = e.currentTarget;
            $(target).toggleClass('checked');
        },

        cancel: function(){
            this.hide();
            this.remove();
        },

        save: function(){
            var self = this;
            var item = this.item;
            var itemModel = this.collection.get(item.id);
            console.log(itemModel);
            var picked = $('label.checked');
            var ids = [];

            for(var i=0; i<picked.length; i++){
                var folder =$(picked[i]);
                ids.push(parseInt(folder.attr('for')));
            }

            if(this.$('#create').val().length >0){
                var name = this.$('#create').val();
                var id = folderStore.addFolder(name);
                ids.push(id);
            }

            setTimeout(function(){
                console.log('ids',ids);
                itemModel.set('folders',ids);
                self.cancel();    
            }, 100);
            
        },

        removeItem: function(){
            var self = this;
            var itemModel = this.collection.get(self.item.id);
            this.collection.remove(itemModel);
            console.log('remove model');
        }

    });
});
