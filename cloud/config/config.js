var config = {

    version: '0.0.1',
    debug: true,

    //
    // Logging Configuration
    //
    log: {
        logLevels: {
            TRACE: 1,
            DEBUG: 2,
            INFO: 3,
            WARN: 4,
            ERROR: 5,
            OFF: 6
        },
        logPrefixes: {
            1: "TRACE",
            2: "DEBUG: ",
            3: "INFO: ",
            4: "WARN: ",
            5: "ERROR: "
        },
        currentLogLevel: 2
    },

    //
    // Session Configuration
    //
    session: {
        // Inactivity timeout (Seconds)
        // lifetime: 24 *  60 * 60 // no need for cloud session to timeout daily per user
        lifetime: 24 * 60 * 60 * 365
    }
};


exports.getConfig = function() {
    return config;
};