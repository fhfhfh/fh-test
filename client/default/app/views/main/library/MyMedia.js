/*--------------------
	app/views/main/library/MyMedia

--------------------*/
define(['jquery',
    'underscore',
    'backbone',
    'text!templates/components/MyMedia.html',
    'text!templates/components/MyMediaFolder.html',
    'text!templates/components/MyMediaItem.html',
    'text!templates/components/MyMediaRow.html',
    'collections/Folders',
    'collections/Library'
], function($, _, Backbone, tpl, folderTpl, itemTpl, rowTpl, folderStore, libStore) {

    return Backbone.View.extend({

        // Backbone specific attributes
        tagName: 'section',
        id: 'myMedia',
        events: {
            'click .cabinetFolder': 'displayFolder',
            'click .cabinetItem': 'displayFile',
            'click #changeView': 'changeView',
            'keyup #search': 'searchItems',
            'click #item': 'displayFile',
            'click #clearBtn': 'clearText'
        },
        template: _.template(tpl),
        folderTpl: _.template(folderTpl),
        itemTpl: _.template(itemTpl),
        rowTpl: _.template(rowTpl),


        initialize: function() {
            _.bindAll(this);
            this.folders = folderStore.models;
            this.libStore = libStore.models;

            // force page refresh when objects added to collections
            folderStore.on('add', this.render);
            libStore.on('add', this.render);
            folderStore.on('remove', this.render);
            libStore.on('remove', this.render);
        },

        render: function() {
            var folders = this.populateFolders();
            var items = this.populateItems();
            var list = this.populateList();
            this.$el.html(this.template({
                folders: folders,
                items: items,
                list: list
            }));
            this.thumbnailUpdate();

            this.bodyScroll = new iScroll(this.$('#cabinetBody')[0], {
                bounceLock: true,
                bounce: false,
                vScrollbar: false
            });
            this.headerScroll = new iScroll(this.$('#cabinetHeader')[0], {
                hScroll: true,
                vScroll: false,
                hScrollbar: false,
                bounceLock: true,
                bounce: false
            });
            this.refreshScroll();

            return this;
        },

        refreshScroll: function() {
            var self = this;
            setTimeout(function() {
                self.bodyScroll.refresh();
                self.headerScroll.refresh();
            }, 100);
        },

        populateFolders: function() {
            var folders = this.folders;
            var tpl = this.folderTpl;
            var str = '';
            for (var i = 0; i < folders.length; i++) {
                var item = folders[i].attributes;
                str += tpl({
                    id: item.id,
                    name: item.name
                });
            }
            return str;
        },

        populateItems: function() {
            // var items = this.libStore;
            var items = libStore.models;
            var tpl = this.itemTpl;
            var str = '';
            for (var i = 0; i < items.length; i++) {
                var item = items[i].attributes;

                if (!item.folders) {
                    item.folders = '23';
                }

                str += tpl({
                    id: item.id,
                    shortTitle: item.shortTitle,
                    title: item.title,
                    type: 'video',
                    folders: item.folders
                });
            }
            return str;
        },

        populateList: function() {
            var folders = this.folders;
            var items = libStore.models;
            var tpl = this.rowTpl;
            var str = '',
                i, j;
            var src = {
                video: "img/library/PlayWhiteSmall.png",
                article: "img/library/ArticleWhiteSmall.png",
                web: "img/library/GlobeWhiteSmall.png"
            };

            for (i = 0; i < folders.length; i++) {
                var item = folders[i].attributes;
                str += '<tr id="folder"><td>' + item.name + '</td><td></td><td></td></tr>';

                for (j = 0; j < items.length; j++) {
                    var asset = items[j].attributes;
                    if (asset.folders.indexOf(item.id) >= 0) {
                        str += tpl({
                            id: asset.id,
                            name: asset.title,
                            type: 'video',
                            date: 'Yesterday',
                            src: src.video,
                            folders: asset.folders
                        });
                    }
                }
            }
            return str;
        },

        thumbnailUpdate: function() {
            var self = this,
                i;
            var items = this.$('.cabinetItem');

            for (i = 0; i < items.length; i++) {
                var item = this.$(items[i]);
                if (item.attr('data-id')) {
                    var model = libStore.get(item.attr('data-id'));
                    item.find('.thumbnail').css({
                        'background': 'url(' + model.attributes.imgUrl + ') no-repeat',
                        'background-size': '110px 70px',
                        'background-position': '8px 1px'
                    });
                }
            }
        },

        displayFolder: function(e) {
            var target = e.currentTarget;
            var title = $(target).text();
            var id = $(target).attr('id');

            $('.cabinetFolder').removeClass('selected');
            $('.cabinetFolder .folderImg').attr('src', 'img/library/AllBoxes@2x.png');
            $(target).addClass('selected');
            $(target).find('.folderImg').attr('src', 'img/library/OpenBox@2x.png');

            if (id === 0) {
                $('.cabinetItem').show();
                this.bodyScroll.refresh();
                return;
            }

            var items = $('.cabinetItem');
            items.hide();

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var folders = $(item).attr('folder') || '';

                if (folders.indexOf(id) >= 0) {
                    $(item).show();
                }
            }
            this.bodyScroll.refresh();
        },

        displayFile: function(e) {
            var target = e.currentTarget;
            var title = $(target).text();
            var id = $(target).attr('data-id');
            var type = $(target).attr('type');
            var model = libStore.get(id);

            var attr = model.attributes;

            attr.current = true;

            // logging data
            console.log("*** \ncurrentTarget: ", attr.current,
                "\nTitle:", attr.title,
                "\nmodel:", model,
                "\ntype: ", type);

            // if (attr.current === true) {
            //     var el = document.createElement('iframe');
            //     el.src = attr.url;
            //     el.width = 550;
            //     el.height = 300;
            //     $('#swipeview-slider').html(el);
            // }

            if (type == 'video') {
                localStorage.setItem('tempVid', JSON.stringify(attr));
                Backbone.history.navigate('video', true, true);
            }
        },

        changeView: function(e) {
            var target = e.currentTarget;
            var name = $(target).text();

            if (name == 'Shelf View') {
                $(target).text('List View');
                $('#cabinet').hide();
                $('#listView').show();
            } else {
                $(target).text('Shelf View');
                $('#cabinet').show();
                this.bodyScroll.refresh();
                $('#listView').hide();
            }
        },

        searchItems: function(e) {
            var target = e.currentTarget;
            var text = $(target).val().toLowerCase();
            var i, j, item, title;
            if (e.which == 13) {
                $(target).blur();
            }


            // search cabinet
            var items = $('.cabinetItem');
            items.show();
            for (i = 0; i < items.length; i++) {
                item = $(items[i]);
                title = item.find('p').attr('title').toLowerCase();
                if (title.indexOf(text) == -1) {
                    console.log(text, title);
                    item.hide();
                }
            }

            // search list
            var items2 = $('tr#item');
            items2.show();
            for (i = 0; i < items2.length; i++) {
                item = $(items2[i]);
                title = item.find('#title').text().toLowerCase();
                if (title.indexOf(text) == -1) {
                    item.hide();
                }
            }
        },

        clearText: function(e) {
            $('#search').val('');
        }

    });
});