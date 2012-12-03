
(function(){
  "use strict";

  window.App = new Peachy.Router({
    app: this,

    pageConfig: Peachy.pageConfig,

    regionConfig: {
      top: "#top",
      header: "#content-header",
      content: "#content-section",
      leftnav: "#leftnav"
    }
  });

  $(document.body).on("selectstart", function(e) {
    e.preventDefault();
  }).quickTap();

  $fh.ready({}, function() {
    window.App.init();

    Backbone.history.start();
  }, function() {
  });


})();
