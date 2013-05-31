/*--------------------
    app/views/main/library/ReadingRoom

--------------------*/
define(['jquery',
        'underscore',
        'backbone',
        'text!templates/components/ReadingRoom.html',
        'text!templates/components/ReadingRoomRow.html',
        'collections/Library',
], function($, _, Backbone, tpl, tpl2, libStore) {

    return Backbone.View.extend({

        // Backbone specific attributes
        tagName     : 'section',
        id          : 'readingRoom',
        events      : {
            'click #changeView' : 'changeView',
            "click #item"       : "displayFile",
            'click #clearBtn'   : 'clearText'

        },
        template    : _.template(tpl),
        rowTpl      : _.template(tpl2),


        initialize : function(){
            _.bindAll(this);
        },

        render: function(){
            var self = this;

            var rows = this.populate();

            this.$el.html(this.template({rows: rows}));
            return this;
        },

        populate: function(){
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
                //this.bodyScroll.refresh();
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

        searchItems: function(e){
            var target = e.currentTarget;
            var text = $(target).val().toLowerCase();
            var i,j;
            if(e.which == 13){
                $(target).blur();
            }


            // // search cabinet
            // var items = $('.cabinetItem');
            // items.show();
            // for(i=0; i<items.length;i++){
            //     var item = $(items[i]);
            //     var title = item.find('p').attr('title').toLowerCase();
            //     if(title.indexOf(text) == -1){
            //         console.log(text, title);
            //         item.hide();
            //     }
            // }

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
        }

    });
});
