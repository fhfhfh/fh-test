/**
 * Application Configuration.
 * 
 */
var appConfig = {
    
  //
  // Common Configuration Values
  //


  "current": "development",
    
  //
  // Configuration Values for each Environment
  //
  "environments": {

    //
    // Development Environment
    //
    "development": {
      "logger": {
        "level": "DEBUG"
      },
      "urls": {
        "baseUrl":"50.11.178.73",                  
        "auth":"/PeachyWebApi/api/authentication/",
        "userProfile":"/PeachyWebApi/api/profileaccount/"
      },
      "session": {
        // Inactivity timeout (Seconds)
        "lifetime": 24 *  60 * 60
      }
    },
    
    //
    // Staging Environment
    //
    "staging": {
      
      "urls": {
        "auth":"",
        "list":""
      },
      "session": {
        // Inactivity timeout (Seconds)
        "lifetime": 24 *  60 * 60
      }
    },
    //
    // Load Testing Environment
    //
    "loadtest": {
     
      "urls": {
        "auth":"",
        "list":""
      },
      "session": {
        // Inactivity timeout (Seconds)
        "lifetime": 24 *  60 * 60
      }
    },
    
    //
    // Production Environment
    //
    "production": {
      
      "urls": {
        "auth":"",
        "list":""
      },
      "session": {
        // Inactivity timeout (Seconds)
        "lifetime": 24 *  60 * 60
      }
    }

  }
    
    
}

module.exports = appConfig;