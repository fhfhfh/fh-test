// Dependencies
var config = require('../../config/config.js').getConfig();
var log = require('../../lib/log/log.js');
var uuid = require('../../lib/uuid/uuid.js');
var utils = require('../../utils/utils.js');
var util = require('util');
var jsonUtils = require('../../lib/jsonUtils.js');
//var respUtils = require('utils/responseUtils.js');



/**
 * Session API Implementation.
 */
var SessionUtils = function() {
    var me = this;
    // Public Functions
    this.createSession = createSession;
    this.isValidSession = isValidSession;
    this.getSession = getSession;
    this.getSessionAttribute = getSessionAttribute;
    this.setSessionAttributes = setSessionAttributes;
    this.destroySession = destroySession;
    this.className = "Session";
    /*
     * Generates a pseudo-random UUID as the session id.
     */
    function generateSessionId() {
        return uuid();
    };

    /*
     * Creates new session object and returns the sessionId.
     */
    function createSession(callback) {

        // Pseudo random sessionId
        var sessionId = generateSessionId();
        var self = this;
        log.info("["+this.className+"]"+"[createSession]>>Generated SessionId: " + sessionId);

        // Initial session object (JSON)
        var sessionObjJson = {
            "sessionId" : sessionId
        };
        
        // Serialize it
        var sessionObj = JSON.stringify(sessionObjJson); 
        log.debug("["+this.className+"]"+"[createSession]>>Attempting to save sessionObj: " + sessionObj);
        
        // Save it
        $fh.session.set(sessionId, sessionObj, config.session.lifetime,
            function(err) {
          
                if (err) {
                    log.debug("["+self.className+"]"+"[createSession]>>Error creating session: " + util.inspect(err));
                    return callback("Failed to save session object to $fh.session()." + JSON.stringify(err), null);
                }
              
                log.debug("["+self.className+"]"+"[createSession]>>Session created successfully: " + sessionId);
                return callback(null, {
                    "sessionId" : sessionId
                });
          
            }
            );

    }; // createSession()

    /*
     * Checks whether the session is valid and active.
     */
    function isValidSession(sessionId, callback) {
        var self = this;
        if (utils.isBlank(sessionId)) {
            return callback("SessionId not provided to isValidSession()", null);
        }

        log.debug("["+this.className+"]"+"[isValidSession]>>Validating SessionId: " + sessionId);

        // Do we have a session object in session for the specified sessionId?
        $fh.session.get(sessionId,
            function handleSessionLoad(err, data) {
          
                if (err) {
                    return callback("Error Fetching Session Object from Session: " + JSON.stringify(err), null);
                }
            
                // Session object found?
                if(data == null) {
                    log.debug("["+self.className+"]"+"[isValidSession]>>Session does not exist for sessionId: " + sessionId);
                    return callback(null, false);
                }
            
                log.debug("["+self.className+"]"+"[isValidSession]>>Found session object: " + data);
            
                // Extend the session expiry time.
                resetSessionTimeout(sessionId, data, function(errMsg, status) {
              
                    // Trouble?
                    if (errMsg != null) {
                        return callback(errMsg, null);
                    }
                
                    // All ok!
                    return callback(null, true);
                
                });
            
            
            
            }
            );

    } // isValidSession()

    /*
     * Gets the session object associated to the specified sessionId.
     */
    function getSession(sessionId, callback) {
        var self = this;
        if (utils.isBlank(sessionId)) {
            return callback("SessionId not provided to getSession()", null);
        }

        log.debug("[Session]"+"[getSession]>>GetSession for SessionId:" + sessionId);

        // Do we have the object in session?
        $fh.session.get(sessionId,function handleSessionLoad(err, data) {
          
                if (err) {
                    return callback("Error Fetching Session Object from session: " + JSON.stringify(err), null);
                }
            
                log.debug("[Session]"+"[getSession]>>Loaded session object from session: " + data);
            
                // Extend the session expiry time.
                resetSessionTimeout(sessionId, data, function(errMsg, status) {
              
                    // Failed to extend session lifetime?
                    if (errMsg != null) {
                        return callback(errMsg, null);
                    }
                
                    // All ok! Deserialize session string and return.
                    return callback(null, JSON.parse(data));
                
                });
            
            }
            );
        
    }; // getSession()

    /*
     * Gets value for the specified attribute stored in the session.
     */
    function getSessionAttribute(sessionId, attrName, callback) {
        var self = this;
        if (utils.isBlank(sessionId)) {
            return callback("SessionId not provided to getSessionAttribute()", null);
        }

        if (utils.isBlank(attrName)) {
            return callback("AttributeName not provided to getSessionAttribute()", null);
        }

        getSession(sessionId, function(errMsg, sessionObj) {

            // Trouble?
            if (errMsg != null) {
                return callback(errMsg, null);
            }

            // Got the data object?
            if (sessionObj) {
                return callback(null, sessionObj[attrName]);
            } else {
                log.error("["+self.className+"]"+"[getSessionAttribute]>>Session Object not found in session for sessionId: " + sessionId);
                return callback(null, null);
            }

        });

    } // getSessionAttribute()

    /**
     * Sets an attribute in the current session object.
     */
    function setSessionAttributes(sessionId, attrMap, callback) {
        var self = this;
        if (utils.isBlank(sessionId)) {
            return callback("SessionId not provided to setSessionAttribute()", null);
        }

        if (attrMap == null) {
            return callback("AttrMap not provided to setSessionAttribute()", null);
        }

        log.debug("["+this.className+"]"+"[setSessionAttributes]>>Set Session Attribute: sessionId:" + sessionId + " AttrMap:" + JSON.stringify(attrMap));

        // Fetch session object from session.
        getSession(sessionId, function(errMsg, sessionObj) {

            // Trouble?
            if (errMsg != null) {
                return callback(errMsg, null);
            }

            // No session state?
            if (sessionObj == null) {
                return callback(null, false);
            }
            
            // Update all items from the attrMap to sessionObj
            for (var attrName in attrMap) {
                var attrValue = attrMap[attrName];
                sessionObj[attrName] = attrValue;    
            }
            
            // Serialize the sessionObj if required.
            var sessionObjToCache = sessionObj;
            if (typeof (sessionObj) == 'object') {
                sessionObjToCache = JSON.stringify(sessionObj);
            }
            
            // Store the sessionObj back to the session.            
            log.debug("["+self.className+"]"+"[setSessionAttributes]>>Attempting to save sessionObj: " + sessionObjToCache);
            $fh.session.set(sessionId, sessionObjToCache, config.session.lifetime,
                function(err) {
              
                    if (err) {
                        return callback("Unable to set attribute into Session:" + JSON.stringify(err), null);
                    }
                
                    // Not invoking resetSessionTimeout(), since the getSession() call above has already done it.
                    // All ok!
                    return callback(null, true);
                
                }
                );
            
        });

    };

    /*
     * Resets the timeout upon every request so that the session doesn't expire
     * until the user is active. Private function that will be called whenever
     * there is call to any of the public methods of this class.
     */
    function resetSessionTimeout(sessionId, sessionObj, callback) {
        var self = this;
        if (utils.isBlank(sessionId)) {
            return callback("SessionId not provided to resetSessionTimeout()", null);
        }

        if (sessionObj == null) {
            return callback("SessionObject not provided to resetSessionTimeout()", null);
        }

        // Serialize the sessionObj if required.
        var sessionObjToCache = sessionObj;
        if (typeof (sessionObj) == 'object') {
            sessionObjToCache = JSON.stringify(sessionObj);
        }

        // Save sessionObj back to cache. Hopefully, this resets the expiry time in the fh.cache?
        $fh.session.set(sessionId, sessionObjToCache, config.session.lifetime,
            function(err) {
          
                if (err) {
                    return callback("Unable to reset Session timeout:" + JSON.stringify(err), null);
                }
            
                log.debug("[Session]"+"[resetSessionTimeout]>>Session timeout reset successfully. SessionId: " + sessionId);
                return callback(null, true);
            
            }
            );

    } // resetSessionTimeout()

    /*
     * Code for invalidating/destroying session
     */
    function destroySession(sessionId, callback) {
        var self = this;
        if (utils.isBlank(sessionId)) {
            return callback("SessionId not provided to destroySession()", null);
        }

        log.debug("["+this.className+"]"+"[destroySession]>>Attempting to Destroy Session for SessionId: " + sessionId);

        $fh.session.remove(sessionId,
            function(err, data) {
          
                if (err) {
                    log.error("["+self.className+"]"+"Error removing session object from the session store:" + JSON.stringify(err));
                    return callback("Error removing session object from the session store:" + JSON.stringify(err), null);
                }
            
                if(data == true) {
                    log.info("["+self.className+"]"+"[destroySession]>>Session object removed successfully from session store. SessionId: " + sessionId);
                    return callback(null, true);                
                } else {
                    log.error("["+self.className+"]"+"[destroySession]>>Error removing session object from session store or bad sessionId. SessionId: " + sessionId);
                    return callback("Error removing session object from session store or bad sessionId. SessionId: " + sessionId, false);                
                }
            
            
            }
            );
        
    } 
}


// Export Module
module.exports = new SessionUtils();
