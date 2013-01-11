// Dependencies
var config = require('../../config/config.js').getConfig();

/**
 * Module for a logger.
 *
 * @author Roshan
 */
var Logger = function() {

    // Public Functions
    this.trace = trace;
    this.debug = debug;
    this.info = info;
    this.warn = warn;
    this.error = error;

    //
    // Methods for Logging.
    //
    function trace(message) {
        if(validate(message)) {
            log(config.log.logLevels.TRACE, message);            
        }        
    }
    
    function debug(message) {        
        if(validate(message)) {
            log(config.log.logLevels.DEBUG, message);            
        }
    }

    function info(message) {
        if(validate(message)) {
            log(config.log.logLevels.INFO, message);
        }
    }

    function warn(message) {
        if(validate(message)) {
            log(config.log.logLevels.WARN, message);
        }
    }

    function error(message) {
        if(validate(message)) {
            log(config.log.logLevels.ERROR, message);
        }
    }
    
    function log(level, message) {
                
        // Level not specified or not a supported log level.
        if(level == null || !config.log.logPrefixes.hasOwnProperty(level)) {
            console.log("Bad log level: " + log + " for message: " + message);
            return;
        }
        
        var levelPrefix = config.log.logPrefixes[level];
        
        var now = new Date();
        var datePrefix = now.toJSON();
        
        if(level >= config.log.currentLogLevel) {
            console.log(levelPrefix + " " + datePrefix + ":" + message);
        }
        
    }
    
    /**
     * Validate if we are ok to log this message?
     */
    function validate(message) {
        
        // Have config?
        if(config == null) {
            console.log("Log configuration not defined. Not logging.");
            return false;            
        }
        
        // Have log levels?
        if(config.log.logLevels == null || config.log.currentLogLevel == null) {
            console.log("Bad logger configuration. Not logging.");
            return false;
        }
                
        // Have message? Silently skip.
        if(message == null) {
            return false;
        }
        
        return true;
    }
    
}; // End Logger

// Export Module
module.exports = new Logger();
