/*
*  Page config defines how pages should be created and what views
*  should be injected in what places
*  Each page config should contain something like this:
    {
      // If a page takes parameters in the url
      // (e.g. /page/:param/:anotherParam)
      // the parameters get passed to the routing handler as
      // arguments. These get added to options.params which is passed
      // to each view of a page. For the example above with a url
      // fragment of /page/1234/4321 the params object will be
      // { param: "1234", anotherParam: "4321"}
      // a string or regular expression:
      // http://backbonejs.org/#Router-routes
      route: "",
      pageClass: "", // The className to set on the #page region
      contentClass: "", // The className to set to the #content
      // region top, header, content and bottom should be false
      // if the region is empty or a function that returns a
      // new View. Each of these functions will be passed an
      // options object which will contain the user and the
      // app objects which exist throughout the lifetime of the app.
      top: function(options) {},
      header: function(options) {},
      content: function(options) {},
      bottom: function(options) {},

      // options should return an object that will be used to extend
      // the options object that will be passed to the constructor
      // functions for each of the regions.
      options: function(options) {},

      // requireTerms and requireLogin specify whether the user is
      // required to have accepted the terms or logged in
      // respectively. They default to true.
      requireTerms: false,
      requireLogin: false
    }
*
*/

Peachy.pageConfig = {
  login: {
    pageClass: "intro",
    contentClass: "box",
    top: function(options) {
      return new Mito.View.TopBar(options);
    },
    header: function(options) {
      return new Mito.RegionView(_.extend({
        className: "content-header",
        template: TPL.headers.Login
      }, options));
    },
    content: function(options) {
      return new Mito.Pages.Login(options);
    },
    bottom: function(options) {
      return new Mito.Components.TabBar(options);
    },

    requireTerms: false,
    requireLogin: false
  },


  dashboard: {
    //empty string or "dashboard" will lead to here
    route: /^$|dashboard/,
    pageClass: "intro",
    contentClass: "",
    top: function(options) {
      return new Mito.Components.TopBar(options);
    },
    header: false,
    content: function(options) {
      return new Mito.Pages.Dashboard(options);
    },
    bottom: function(options) {
      return new Mito.Components.TabBar(_.extend({
        tab: "home"
      }, options));
    }
  },
