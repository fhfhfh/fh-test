$fh = {
  cacheStore: {},
  session : {
    //$fh.session.set(sessionId, sessionObj, config.session.lifetime,
    set: function(id, sessionObj, life, cb){
      this.sessionStore[id] = sessionObj;
      return cb(undefined, id);
    },
    get: function(id, cb){
      var o = this.sessionStore[id];
      return cb(undefined, o);
    },
    remove: function(id, cb){
      delete this.sessionStore[id];
      return cb(null, true);
    },
    sessionStore : {}
  },
  cache: function(params, cb){
    var act = params.act,
    key = params.key,
    value = params.value,
    expire = params.expire;

    switch(act){
      case "save":
        this.cacheStore[key] = value;
        return cb(null, {succ: true});
      case "load":
        var o = this.cacheStore[key];
        return cb(null, o);
      case "remove":
        delete this.cacheStore[key];
        return cb(null, true);
      default:
        console.log('No valid act specified to $fh.cache');
    }
  }

};

module.exports = $fh;