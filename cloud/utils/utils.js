// Dependencies
var log = require("../lib/log/log.js");

/**
 * Collection of utility / helper functions.
 */
var Utils = function() {

    // Public functions
    this.isBlank = isBlank;
    this.typeOf = typeOf;
    this.isInteger = isInteger;
    this.logStackTrace = logStackTrace;
    this._getXMLTag = _getXMLTag;
    
    /**
     * Is specified string reference null or empty?
     * 
     * @param field
     * @returns {Boolean}
     */
    function isBlank(field) {

        if (field == null || field == undefined)
            return true;

        if (typeof field !== "string")
            return false;

        if (field.trim().length === 0)
            return true;

        return false;
    }

    /**
     * Determine the type of given object (Array, Object, String, Function).
     * @return String indicating 'array', 'object', 'string', 'function'
     */
    function typeOf(obj) {

        // If obj is an array, 'typeof' returns 'object'.
        // So we additional use 'instanceof' to see if this is an Array object.
        if (typeof obj === 'object' && obj instanceof Array) {
            return 'array';
        } 

        // For everything else, the typeof value suffices
        return typeof obj;

    }
    
    /**
     * Check if the given parameter / string is actually an integer value.
     */
    function isInteger(value) {
        
        if((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
            return true;
        } else {
            return false;
        }
        
    }

    /**
     * Convenience helper to log a stacktrace from the given error object.
     */
    function logStackTrace(msg, err) {
        
        if(!err || err == null || err == undefined) {
            log.error("Stack Trace Logger: Undefined or null error object passed");
            return;
        }
        
        if (typeof err !== 'object') {
            log.error('Stack Trace Logger: Argument is not an Object');
            return;
        }

        log.error('====== Err Object Stack Trace Begin =======: ' + msg)
        if (err.message) {
            log.error("Message: " + err.message);
        }
        
        if (err.stack) {
            log.error("Stacktrace: " + err.stack);
        }
        log.error('====== Err Object Stack Trace End =======')
        return;
        
    }
    
   function _getXMLTag(res, tagname){
    if (!res || !tagname){
      return null;
    }
    var rex = "<" + tagname +  ">(.*)<\/" + tagname + ">";
    rex = new RegExp(rex);


    var r = res.match(rex);
    r = (r && r.length===2) ? r[1] : null;
    return r;
  }

    
}; // End Class Utils

// Export Module
module.exports = new Utils();