$( document ).bind( "pageinit", function( event, data ){
  $('#btn').on('click', function() {
    login();
  });
  function login(){
    $fh.act({
      "act": "loginAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
          // Empty
          },
          "payload": {
            "login": {
              "userId": "demo",
              "password": "demo"
            }
          }
        }

      }
    }, function(res) {
      // Cloud call was successful. Alert the response
 
      alert('Got response from cloud:' + JSON.stringify(res));
    }, function(msg, err) {
      // An error occured during the cloud call. Alert some debugging information
      alert('Cloud call failed with error:' + msg + '. Error properties:' + JSON.stringify(err));
    });
  }
  
  //----------------------------------------------------------------------------------------------------------------------
  $('#logout').on('click', function() {
    logout();
  });
  function logout(){
    $fh.act({
      "act": "logoutAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "logout": {
          // Empty
          }
          }
        }
      }

    }, function(res) {
      // Cloud call was successful. Alert the response
 
      alert('Got response from cloud:' + JSON.stringify(res));
    }, function(msg, err) {
      // An error occured during the cloud call. Alert some debugging information
      alert('Cloud call failed with error:' + msg + '. Error properties:' + JSON.stringify(err));
    });
  }
  
  //-----------------------------------------------reset password----------------------------------------------------------------------------------





  $('#reset').on('click', function() {
    logout();
  });
  function logout(){
    $fh.act({
      "act": "resetAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
          // Empty
          },
          "payload": {
            "resetPassword": {
              "userId": "firstname.lastname@email.com",
              "answer": "foobar"
            }
          }
        }
      }


    }, function(res) {
      // Cloud call was successful. Alert the response
 
      alert('Got response from cloud:' + JSON.stringify(res));
    }, function(msg, err) {
      // An error occured during the cloud call. Alert some debugging information
      alert('Cloud call failed with error:' + msg + '. Error properties:' + JSON.stringify(err));
    });
  }











});
  