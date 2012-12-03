
Peachy.Router = (function() {
  "use strict";

  var page = $("#page"),
    content = $("#content"),
    loadingIcon = $("<img class='loading-icon' src='img/icons/loading-icon.gif' />");


  /**
  *  Initialise a region by injecting the view created by a
  *  constructor function, or else if the constructor doesn't exist
  *  remove the content in the region from the previous page.
  *
  *  @param {Marionette.Region} region The region to inject content.
  *  @param {Function} constructor A constructor function that
  *   returns a view.
  *  @param {Object} options An arguments object to pass
  *   to the constructor.
  */
  function initRegion(region, constructor, options) {
    if(typeof constructor === "function") {
      region.show(constructor(options));
      region.$el.show();
    }
    else {
      region.close();
      region.$el.hide();
    }
  }

  /**
  * Use the arg map supplied in the config object or
  * Create one by using a regex to match ":name" in the
  * route.
  *
  * @param {Object} config The config object for the page.
  * @returns {Array} An array of names for arguments that can
  *  be passed to the page
  */
  function buildArgMap(config) {
    if(config.argMap) {
      return config.argMap;
    }
    if(!config.route) {
      return null;
    }
    var route = config.route,
      regex = /:(\w+)/g,
      argMap = [],
      matches;

    while((matches = regex.exec(route)) !== null) {
      argMap.push(matches[1]);
    }
    return argMap;
  }

  var _super = Backbone.Router,
    _proto = _super.prototype;

  return _super.extend({

    constructor: function(options) {
      this.pageConfig = options.pageConfig;
      this.regionConfig = options.regionConfig;

      this.regions = {};

      _proto.constructor.call(this, options);
    },

    init: function() {
      var self = this;
      this.user = new Peachy.Models.User();
      // get lists of constants for dropdown
      // lists and the like
      this.constants = new Peachy.Models.Constants(null, {
        user: this.user
      });

      // we need to wait until we have a token to get the constants
      // do it just in case
      this.user.on("authenticated", function() {
        self.constants.fetch();
      });
      // match anything and redirect to the dashboard
      // this will be checked last, so if a valid match is
      // found this will never happen.
      this.route(/.+/, "anything", function() {
        this.navigate("dashboard", true);
      });
      this.route("logout", "logout", _.bind(this.logout, this));

      this.setupRegions();
      this.setupRoutes();

    },

    setupRegions: function() {
      var regionConfig = this.regionConfig,
        regions = this.regions;

      for(var regionName in regionConfig) {
        var selector = regionConfig[regionName];
        regions[regionName] = new Peachy.Region({
          el: $(selector)[0],
          name: regionName
        });
      }
    },

    setupRoutes: function() {
      var config = this.pageConfig;
      for(var page in config) {
        // add the name to the config object
        // so it doesn't have to be defined a second
        // time by the user
        config.name = page;
        this.initPage(page, config[page]);
      }
    },

    logout: function() {
      this.navigate("login", true);
      this.user.logout();
    },


    /**
    *  Load each of the pages views into their
    *  appropriate regions
    *
    *  @param {Object} config The pageConfig object that
    *   defines the pages views.
    *  @param {options}
    */
    loadPage: function(config, options) {
      // call the options function of the config
      // to generate custom options that will be passed
      // to each of the views.
      var self = this;
      if(typeof config.options === "function") {
        _.extend(options, config.options(options));
      }


      // add classes to the main regions
      page.attr("class", config.pageClass || "");
      content.attr("class", config.contentClass || "");

      var regions = this.regions,
        activeRegions = [],
        loaded = 0;

      function gotResources() {

          if(++loaded === activeRegions.length) {
            loadingIcon.remove();

            for(var i = 0, il = activeRegions.length; i < il; i++) {
              activeRegions[i].show();
            }
            activeRegions = null;

          }
      }



      for(var regionName in regions) {
        var region = regions[regionName],
          viewCtr = config[regionName];

        if(viewCtr) {
          activeRegions.push(region);
          region.setView(viewCtr(options));
        }
        else {
          region.hide();
        }
      }

      loadingIcon.appendTo(document.body);
      // for(var i = 0, il = activeRegions.length; i < il; i++) {
      //   activeRegions[i].view.fetchResources(gotResources, function (model,err){
      //      console.log("got error ");
      //     console.log(err);
      //      if(err && err.code == 403){
      //        self.navigate("logout",true);
      //        self.user.logout();
      //        loadingIcon.remove();
      //        jAlert("Session has timed out. Please login again","Session Timeout");
      //      }else if(err && err.code == 404 || err == 'error_ajaxfail'){
      //        //no data available and could not connect to the server
      //        jAlert("Could not connect to the server and there was no cache data available","Error Contacting Server");
      //        self.navigate('dashboard',true);
      //        loadingIcon.remove();
      //      }else if (err){
      //       alert(err);
      //      }
      //   });
      // }

    },

    /**
    *  Set up routing for a page config object
    *
    *  @param {String} name The name of the page
    *  @param {Config} config The config object for the page
    */
    initPage: function(name, config) {
      var router = this,
        user = this.user,
        options = {
          router: this,
          user: user
        },
        argMap = buildArgMap(config);

      var route = function() {
        var opts = _.clone(options);

        // copy the parameters passed as arguments(parsed from
        // the url) to the params object.
        if(arguments.length && argMap && argMap.length) {
          var params = {};
          for(var i = 0, il = argMap.length; i < il; i++) {
            params[argMap[i]] = arguments[i];
          }
          opts.params = params;
        }

        // load the page
        router.loadPage(config, opts);

      };

      this.route(config.route || name, name, function() {
        var loggedIn = user.isAuthenticated();

        if((config.requireLogin === true ||
            config.requireLogin === undefined) &&
           !loggedIn) {
          return router.navigate("login", true);
        }

        return route.apply(this, arguments);
      });


    }

  });

})();
