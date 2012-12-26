/**
 * Collection of utility / helper functions to work with JSON objects.
 */
var JsonUtils = function() {

    // Public functions
    this.toStr = toStr;
    this.getNsPrefix = getNsPrefix;
    this.enforceArray = enforceArray;
    this.isEmpty = isEmpty;
    this.isJsonPath = isJsonPath;
    this.isPath = isPath;
    this.isEmptyPath = isEmptyPath;
    this.getPath = getPath;
    this.getJsonPath = getJsonPath;
    this.getOptionalJsonPath = getOptionalJsonPath;
    this.clone = clone;

    /**
     * Pretty print the given JSON object.
     */
    function toStr(jsonObj) {
        return JSON.stringify(jsonObj, null, '\t');
    }
    
    /**
     * Fetch the NS Prefix for the specified Href from the given namespace map.
     * 
     * @param nsMap
     * @param href
     * @returns {String}
     */
    function getNsPrefix(nsMap, href) {
        for (key in nsMap) {
            if (!nsMap.hasOwnProperty(key)) {
                continue;
            }
            if (nsMap[key] === href) {
                return key + ":";
                break;
            }
        }
    }

    /**
     * When converting XML to JSON, we are not able to infer if something was
     * meant to be a single object or an array (since we don't refer to the
     * schema at that time). This method is invoked to enforce an array
     * structure around a single element. That can make subsequent processing
     * simpler and consistent.
     * 
     * @param jsonObj
     * @param key
     * @returns
     */
    function enforceArray(jsonObj, key) {

        if(jsonObj == null || jsonObj[key] == null) {
            return [];
        }

        var elem = jsonObj[key];

        // Is this an array of a single instance?
        if (elem instanceof Array) {
            return jsonObj[key];
        } else {
            jsonObj[key] = [jsonObj[key]];
            return jsonObj[key];
        }

    }
    
    /**
     * Checks for an empty object like {}
     * @param obj
     * @returns {Boolean}
     */
    function isEmpty(obj){
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)){
                return false;
            }
        }
        return true;
    }

    /**
     * Check if the specified path exists under the given Json Object. Navigates
     * thru the dot-separated path in the Json Object tree.
     * 
     * @param jsonObj
     * @param path
     * @returns {Boolean}
     */
    function isPath(jsonObj, path) {

        if (jsonObj == null) {
            return false;
        }

        var curr = jsonObj;
        var pathArray = path.split(".");

        for ( var i in pathArray) {
            var component = pathArray[i];
            if (curr[component] == null) {
                return false;
            } else {
                curr = curr[component];
            }
        }
        return true;

    }
    
    /**
     * Does the specified JSON path have an empty value?
     * 
     * @return true, if empty
     * @return false, if not empty
     */
    function isEmptyPath(jsonObj, path) {
        
        var resp = this.getPath(jsonObj, path);

        // Nothing on this path?
        if(resp == null || resp == undefined) {
            return true;
        }

        // Empty string?
        if (typeof resp == "string") {
            if (resp.trim().length === 0) {
                return true;            
            }
        }
            
        return false;

    }

    /**
     * Navigate thru the Json Object using the specified dot-separated path.
     * 
     * @param jsonObj
     * @param path
     * @returns
     */
    function getPath(jsonObj, path) {

        if (jsonObj == null) {
            return null;
        }

        var pathArray = path.split(".");
        var curr = jsonObj;

        for (var i in pathArray) {
            var component = pathArray[i];
            if (curr[component] == null) {
                return null;
            } else {
                curr = curr[component];
            }
        }
        return curr;

    }

    /**
     * Does the specified JSON path exist?
     * 
     * @param jsonRoot
     * @param pathArray
     */
    function isJsonPath(jsonObj, pathArray) {

        var curr = jsonObj;
        for (var i in pathArray) {
            var component = pathArray[i];
            if (curr[component] == null) {
                return false;
            } else {
                curr = curr[component];
            }
        }
        return true;

    }

    /**
     * Get element at the specified JSON path. This is a convenience method to
     * navigate thru the JSON tree. Typically a blind navigation could result in
     * "undefined" exceptions. This method adds null checks to make sure we
     * don't navigate the tree too far without null checks.
     * 
     * @param jsonObj
     * @param pathArray
     * @returns
     */
    function getJsonPath(jsonObj, pathArray) {

        if (jsonObj == null) {
            return null;
        }

        var curr = jsonObj;
        for (var i in pathArray) {
            var component = pathArray[i];
            if (curr[component] == null) {
                return null;
            } else {
                curr = curr[component];
            }
        }
        return curr;

    }

    /**
     * Get element at the specified JSON path. Return an empty string if an
     * element value is not found at the specified path.
     * 
     * @param jsonObj
     * @param pathArray
     * @returns
     */
    function getOptionalJsonPath(jsonObj, pathArray) {

        var curr = jsonObj;
        for ( var i in pathArray) {
            var component = pathArray[i];
            if (curr[component] == null) {
                return "";
            } else {
                curr = curr[component];
            }
        }
        return curr;

    }

    /**
     * Duplicate a JSON object
     * @param object the object to clone
     * @returns object the clone
     */
    function clone(object){
      var c = {};
      for (var i in object){
        if (object.hasOwnProperty(i)){
          c[i] = object[i];
        }
      }
      return c;
    }

}; // End Class Utils

// Export Module
module.exports = new JsonUtils();