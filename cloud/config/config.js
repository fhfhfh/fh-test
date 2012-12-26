var config = {
    
    version: '0.0.1',
    debug: true,
    
    //
    // Sales Force REST Configuration
    //
    salesforceREST: {
//        URL: 'https://cs3-api.salesforce.com/services/data/v20.0/',
        soapURL: 'https://cs3-api.salesforce.com/services/Soap/c/25.0/',//'https://cs12-api.salesforce.com/services/Soap/c/25.0/',
       //loginUrl : 'https://login.salesforce.com'
        loginUrl : 'https://test.salesforce.com', // you can change login URL to point sandbox env.
        metadataSoapURL: 'https://cs3-api.salesforce.com/services/Soap/m/25.0/',
        maximumQueryRetries : 2
    },
    
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
        lifetime: 24 *  60 * 60
    },
    
  setSoapUrl : function(url) {
    if(url){
      this.salesforceREST.soapURL = url;
    }
  },
  
  setMetadataSoapUrl : function(url) {
    if(url){
      this.salesforceREST.metadataSoapURL = url;
    }
  }
    
}


exports.getConfig = function() {
    return config;
}