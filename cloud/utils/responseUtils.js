// Dependencies
var constants = require('../config/constants.js');
var jsonUtils = require('../lib/jsonUtils.js');

/**
 * Collection of utility functions to construct JSON responses to the client.
 */
var ResponseUtils = function() {

    // Public Functions
    this.constructResponse = constructResponse;
    this.constructStatusResponse = constructStatusResponse;

    /**
     * Helper function. Construct a placeholder template for a typical Response
     * JSON message.
     * 
     * @return JSON
     */
    function constructResponse() {
        return response = {
            "response" : {
                "head" : {
                },
                "payload" : {}
            }
        };
    }

    /**
     * Helper function. Construct a "status" response JSON message.
     * 
     * @param opName
     * @param statusCode
     * @param statusObject returned from sf.
     * @return JSON
     */
    function constructStatusResponse(opName, code, status,jsonObj) {
        var message;       
        var wrapper = this.constructResponse();
        wrapper.response.payload = jsonObj;
        wrapper.response.payload["status"] = {
            "msg" : status,
            "code" : code
        };
       
        return wrapper;

    }

}; // End Class ResponseUtils

// Export Module
module.exports = new ResponseUtils();