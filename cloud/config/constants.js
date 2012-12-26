var jsonUtils = require('../lib/jsonUtils.js');

/**
 * Class defining CONSTANTS used across cloud code.
 */
var Constants = function() {
    //exposed methods
    this.getStatusMessage = getStatusMessage;
    this.errorCodeField = "errorCode";
    this.errorMsgField = "message";

    // Various response error codes from the endpoints
    this.SF_INVALID_SESSION = "sf:INVALID_SESSION_ID";
    this.RESP_PROCESSING = "SUCCESS_102";
    this.RESP_SUCCESS = "SUCCESS_200";
    this.RESP_INACTIVE_ENROLL = "ERR_402";
    this.RESP_BAD_INPUT = "ERR_400";
    this.RESP_AUTH_FAILED = "ERR_401";
    this.RESP_SERVER_ERROR = "ERR_500";
    this.RESP_SOAP_FAULT = "ERR_520";
    this.RESP_SOAP_TIMEOUT = "ERR_521";
    this.RESP_SOAP_BAD_RESP = "ERR_522";
    this.RESP_REST_BAD_RESP = "ERR_523";
    this.EMPTY_RESPONSE = "ERR_524";
    this.RESP_TOKEN_POLL_DATA_NOT_READY = "SUCCESS_102";
    this.ST_LOGIN_MUST_USE_SECURITY_TOKEN = "ERR_403";

    this.statusMessages = {
      "ERR_403" : "Security token missing.",
      "ERR_524": "No Records Found.",
      "FIELD_CUSTOM_VALIDATION_EXCEPTION": "Failed to create/update object with the specified values.",
      "FIELD_INTEGRITY_EXCEPTION": "Failed to create/update object with the specified values.",
      "INVALID_CROSS_REFERENCE_KEY": "Failed to create/update object with the specified values.",
      "FIELD_FILTER_VALIDATION_EXCEPTION": "You can't violate field integrity rules.",
      "DELETE_FAILED": "You can't delete a record because it is in use by another object.",
      "ERR_401": "Invalid or Missing SessionId.",
      "ERR_500": "Internal Server Error, please try again in some time.",
      "ERR_400": "Bad Input.",
      "SUCCESS": "Success",
      "INACTIVE_OWNER_OR_USER":"Cannot perform operation with an inactive user",
      "INSUFFICIENT_ACCESS_ON_CROSS_REFERENCE_ENTITY" : "Insufficient access",
      "INSUFFICIENT_ACCESS_OR_READONLY" : "Read only access",
      "INVALID_ACCESS_LEVEL" : "Invalid access level",
      "NOT_FOUND" : "Requested Id/Object not found.",
      "CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY" : "You don't have the permissions to update the fields"
    };
    this.INVALID_ARGUMENT_TYPE = "Invalid argument type";
    this.INVALID_ASSIGNEE_TYPE = "Invalid assignne type";
    this.INVALID_ASSIGNMENT_RULE = "Invalid assignment rule";
    this.INVALID_BATCH_OPERATION = "Invalid batch operation";
    this.INVALID_CONTENT_TYPE = "Invalid content type";
    this.INVALID_CREDIT_CARD_INFO = "Invalid credit card info`";
    this.INVALID_CROSS_REFERENCE_KEY = "Invalid cross reference key";
    this.INVALID_CROSS_REFERENCE_TYPE_FOR_FIELD = "Invalid cross reference type for field";
    this.INVALID_CURRENCY_CONV_RATE = "Invalid currency conversion rate";
    this.INVALID_CURRENCY_CORP_RATE = "Invalid currency corporation rate";
    this.INVALID_CURRENCY_ISO = "Invalid currency ISO";
    this.INVALID_DATA_CATEGORY_GROUP_REFERENCE = "Invalid data category group reference";
    this.INVALID_DATA_URI = "Invalid data URI";
    this.INVALID_EMAIL_ADDRESS = "Invalid email address";
    this.INVALID_EMPTY_KEY_OWNER = "Invalid empty key owner";
    this.INVALID_FIELD = "Invalid field";
    this.INVALID_FIELD_FOR_INSERT_UPDATE = "Invalid field for insert update";
    this.INVALID_FIELD_WHEN_USING_TEMPLATE = "Invalid field when using template";
    this.INVALID_FILTER_ACTION = "Invalid filter action";
    this.INVALID_GOOGLE_DOCS_URL = "Invalid google docs URL";
    this.INVALID_ID_FIELD = "Invalid id field";
    this.INVALID_INET_ADDRESS = "Invalid INET address";
    this.INVALID_LINEITEM_CLONE_STATE = "Invalid Line Item";
    this.INVALID_MASTER_OR_TRANSLATED_SOLUTION = "Invalid";
    this.INVALID_MESSAGE_ID_REFERENCE = "Invalid";
    this.INVALID_OPERATION = "Invalid Operation";
    this.INVALID_OPERATOR = "Invalid";
    this.INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST = "Invalid";
    this.INVALID_PACKAGE_VERSION = "Invalid";
    this.INVALID_PARTNER_NETWORK_STATUS = "Invalid";
    this.INVALID_PERSON_ACCOUNT_OPERATION = "Invalid";
    this.INVALID_READ_ONLY_USER_DML = "Invalid";
    this.INVALID_SAVE_AS_ACTIVITY_FLAG = "Invalid";
    this.INVALID_SESSION_ID = "Invalid";
    this.INVALID_SETUP_OWNER = "Invalid";
    this.INVALID_STATUS = "Invalid Status";
    this.INVALID_TYPE = "Invalid Type";
    this.INVALID_TYPE_FOR_OPERATION = "Invalid";
    this.INVALID_TYPE_ON_FIELD_IN_RECORD = "Invalid";
    
    this.SUCCESS_STATUS={"code":this.RESP_SUCCESS, "msg":"success"};
    
    function getStatusMessage(code, status){
      var message;
      var statusCode;
      if(!status || !status[this.errorCodeField] || !status[this.errorMsgField]) {
        if(code){
          statusCode = code;
        }else{
          statusCode = this.RESP_SERVER_ERROR;
        }
      }else{
        statusCode = status[this.errorCodeField];
      }
      switch(statusCode) {
        case "FIELD_CUSTOM_VALIDATION_EXCEPTION":
        case "FIELD_INTEGRITY_EXCEPTION":
        case "NOT_FOUND":
          message = status[this.errorMsgField];
          break;
          
        default:
          if(this.statusMessages[statusCode]){
            message = this.statusMessages[statusCode];
          }else{
            message = this.statusMessages[this.RESP_SERVER_ERROR];
          }
          break;
      }
      return message;
    }
};

// Export Module
module.exports = new Constants();
