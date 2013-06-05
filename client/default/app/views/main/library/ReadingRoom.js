/*--------------------
    app/views/main/library/ReadingRoom

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/ReadingRoom.html',
        'text!templates/components/ReadingRoomRow.html',
        'text!templates/components/ReadingRoomItem.html',
        'collections/Library',
        'collections/Folders'
], function($, _, Backbone, tpl, rowTpl, itemTpl, libStore, folders) {

    return Backbone.View.extend({

        // Backbone specific attributes
        tagName     : 'section',
        id          : 'readingRoom',
        events      : {
            'click #changeView' : 'changeView',
            "click #item"       : "displayFile",
            'click #clearBtn'   : 'clearText',
            'keyup #search'     : 'searchItems',
            'click #item'       : 'displayFile',

        },
        template    : _.template(tpl),
        rowTpl      : _.template(rowTpl),
        itemTpl     : _.template(itemTpl),

        libStore    : libStore.models,
        folderStore : folders.models,


        initialize : function(){
            _.bindAll(this);

            // force page refresh when objects added to collection
            libStore.on('add', this.render);
            libStore.on('remove', this.render);
        },

        render: function(){
            var self = this;

            // var rows = this.populate();
            var items = this.populateItems();
            var list = this.populateList();

            this.$el.html(this.template({list: list, items: items}));

            this.bodyScroll = new iScroll(this.$('#cabinetBody')[0],{
                bounceLock  : true,
                bounce      : false,
                vScrollbar  : false
            });

            this.thumbnailUpdate();

            return this;
        },

        populateList: function(){
            var src = {
                video: "img/library/PlayWhiteSmall.png",
                article: "img/library/ArticleWhiteSmall.png",
                web: "img/library/GlobeWhiteSmall.png",
                };

            var items = libStore.models;
            var tpl = this.rowTpl;
            var str = '';
            for(var i=0; i<items.length; i++){
                var item = items[i].attributes;
                if(item.folders.indexOf(1) >= 0){
                    str+=tpl({
                        id      :item.id, 
                        name    :item.title,
                        type    : 'video',
                        date    : 'Today',
                        src     : src.video,
                        folders : item.folders
                    }); 
                }
            }
            return str;
        },

        populateItems: function(){
            var items = this.libStore;
            var tpl = this.itemTpl;
            var str = '';
            for(var i=0; i<items.length; i++){
                var item = items[i].attributes;

                if(!item.folders || item.folders.indexOf(1) === -1){
                    continue;
                }

                str+=tpl({
                    id      :item.id, 
                    shortTitle  :item.shortTitle,
                    title   :item.title,
                    type    : 'video',
                    folders : item.folders
                });
            }
            return str;
        },

        // populateList: function(){
        //     var folders = this.folderStore;
        //     var items = this.libStore;
        //     var tpl = this.rowTpl;
        //     var str = '', i, j;
        //     var src = {
        //         video: "img/library/PlayWhiteSmall.png",
        //         article: "img/library/ArticleWhiteSmall.png",
        //         web: "img/library/GlobeWhiteSmall.png",
        //     };

        //     for(i=0; i<folders.length; i++){
        //         var item = folders[i].attributes;
        //         str += '<tr id="folder"><td>'+item.name+'</td><td></td><td></td></tr>';

        //         for(j=0;j<items.length;j++){
        //             var asset = items[j].attributes;
        //             if(asset.folders.indexOf(1) >= 0){
        //                 str+= tpl({
        //                     id: asset.id,
        //                     name: asset.title,
        //                     type: 'video',
        //                     date: 'Today',
        //                     src: src.video
        //                 });
        //             }
        //         }
        //     }
        //     return str;
        // },

        changeView: function(e){
            var target = e.currentTarget;
            var name = $(target).text();

            if(name == 'Shelf View'){
                $(target).text('List View');
                $('#cabinet').hide();
                $('#listView').show();
            }
            else {
                $(target).text('Shelf View');
                $('#cabinet').show();
                this.bodyScroll.refresh();
                $('#listView').hide();
            }
        },

        displayFile: function(e){
            console.log(e);
            var target  = e.currentTarget;
            var title   = $(target).text();
            var id      = $(target).attr('data-id');
            var type    = $(target).attr('type');
            var model   = libStore.get(id);

            if(type == 'video'){
                localStorage.setItem('tempVid', JSON.stringify(model));
                Backbone.history.navigate('video', true, true);
            }
        },

        thumbnailUpdate: function(){
            var self=this,i;
            var items = this.$('.cabinetItem');

            for(i=0;i<items.length;i++){
                var item = this.$(items[i]);
                if(item.attr('data-id')){
                    var model =libStore.get(item.attr('data-id'));
                    item.find('.thumbnail').css({
                        'background':'url('+model.attributes.imgUrl+') no-repeat',
                        'background-size':'110px 70px',
                        'background-position':'8px 1px'
                    });
                }
            }
        },

        searchItems: function(e){
            var target = e.currentTarget;
            var text = $(target).val().toLowerCase();
            var i,j;
            if(e.which == 13){
                $(target).blur();
            }


            // // search cabinet
            var items = $('.cabinetItem');
            items.show();
            for(i=0; i<items.length;i++){
                var item = $(items[i]);
                var title = item.find('p').attr('title').toLowerCase();
                if(title.indexOf(text) == -1){
                    console.log(text, title);
                    item.hide();
                }
            }

            // search list
            var items2 = $('tr#item');
            items2.show();
            for(i=0; i<items2.length;i++){
                var item = $(items2[i]);
                var title = item.find('#title').text().toLowerCase();
                if(title.indexOf(text) == -1){
                    item.hide();
                }
            }
        },

        clearText: function(e){
            $('#search').val('');
        },

        displayFile: function(e){
            var target  = e.currentTarget;
            var title   = $(target).text();
            var id      = $(target).attr('data-id');
            var type    = $(target).attr('type');
            var model   = libStore.get(id);

            if(type == 'video'){
                localStorage.setItem('tempVid', JSON.stringify(model));
                Backbone.history.navigate('video', true, true);
            }
        },

    });
});
