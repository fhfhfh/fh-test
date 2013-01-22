/**
 * Class defining CONSTANTS used across cloud code.
 */
var Constants = function() {

     // Various response error codes from the endpoints
    this.RESP_SUCCESS = "SUCCESS_200";
    this.RESP_BAD_INPUT = "ERR_400";
    this.RESP_AUTH_FAILED = "ERR_401";
    this.RESP_SERVER_ERROR = "ERR_500";
   
};

// Export Module
module.exports = new Constants();
