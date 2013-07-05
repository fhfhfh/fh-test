/*
 * This is a Collection of all Activities
 * which lives in FH cloud (mongoDB)
 */

define(['backbone',
        'models/ActivityItem',
        'models/Acts',
        'models/Store'
        ], function(Backbone, model, Act, Store) {


    var collection = Backbone.Collection.extend({
        //Backbone specific attributes
        model : model,
        storageKey: 'peachy_activities',
        activities : [],
        index: 1,

        initialize: function(){
            var self=this;

            this.on('add', function(){
                self.index++;
            });

            this.on('change:favorite', function(){
                self.saveFavs();
            });

            this.on('change:recent', function(){
                self.saveFavs();
            });

            this.loadFavs();
        },

        singleSearch: function(term, type, cb){
            var self = this;

            Act.call("searchActivityAction", {"term":term,"type":type},
                function(res){
                    var data = res.payload.activities;
                    for(var i=0;i<data.length;i++){
                        data[i].id = self.index;
                        var asset = new self.model(data[i]);
                        self.add(asset);
                    }

                    return cb(null,data);
                }, function(err, msg){
                    console.warn(err, msg);
                    return cb(err,null);
                }
            );
        },

        search: function(type){
            var arr = [];
            this.each(function(model){
                var item = model;
                if(item.attributes.type === type){
                    arr.push(item);
                }
            });
            return arr;
        },


        // Get list of activities of a specific type
        getActivities: function(type, cb){
            var self = this;

            if(self.activities[type]){
                var list = self.search(type);
                return cb(null,list);
            }

            Act.call("fetchActivityAction", {"type":type},
                function(res){
                    var list = res.payload.activities;
                    var models = self.populateCollection(list, type);
                    self.activities[type] = true;
                    return cb(null, models);
                }, function(err, msg){
                    console.warn(err, msg);
                    return cb(err, null);
                }
            );
        },

        populateCollection: function(list, type){
            var self = this;

            for(var i=0;i<list.length;i++){
                var item =list[i];
                item.type = type;
                item.id = self.index;
                var asset = new self.model(item);
                self.add(asset);
            }
            return this.search(type);
        },

        store: function(){
            var models = JSON.stringify(this.models);
            Store.save(this.storageKey, models, function(){
                console.log('saved activities to localStorage');
            });
        },

        load: function(){
            var self = this;
            Store.load(this.storageKey, function(bool,res){
                if(bool && res){
                    var obj = JSON.parse(res);
                    for(var i=0;i<obj.length;i++){
                        self.add(obj[i]);
                    }
                }
            });
        },

        setRecentOrFav: function(string, obj){
            if(string === "favorite"){
                obj.set("favorite", true);
            } else {
                obj.set("recent", true);
            }
            this.saveFavs();
        },

        getRecentOrFav: function(string){
            var arr = [];
            var i,j;
            var items = this.models;

            if(string === "favorite"){
                for(i=0;i<items.length;i++){
                    if(items[i].attributes.favorite === true){
                        items[i].attributes.type = "favorite";
                        arr.push(items[i]);
                    }
                }
                return arr;
            } else {
                for(j=0;j<items.length;j++){
                    if(items[j].attributes.recent === true){
                        items[j].attributes.type = "recent";
                        arr.push(items[j]);
                    }
                }
                return arr;
            }
        },

        saveFavs: function(){
            var items = this.models;
            var i = 0;
            var arr = [];

            for(i;i<items.length;i++){
                if(items[i].attributes.favorite === true || items[i].attributes.favorite === true){
                    arr.push(items[i]);
                }
            }

            var data = JSON.stringify(arr);
            Store.save("peachy_activity_favs", data, function(){
                console.log('saved favorite activities to localStorage');
            });

        },

        loadFavs: function(){
            var self = this;
            Store.load("peachy_activity_favs", function(bool,res){
                if(bool && res){
                    var obj = JSON.parse(res);
                    for(var i=0;i<obj.length;i++){
                        var asset = new model(obj[i]);
                        self.add(asset);
                    }
                }
            });
        }

    });
    return new collection();
});