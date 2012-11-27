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
  
  //------------------------------------------------------logout----------------------------------------------------------------
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



  //------------------------------------------------userProfile--------------------------------------------------------

  $('#userProfile').on('click', function() {
    userProfile();
  });
  function userProfile(){
    $fh.act({
      "act": "userProfileAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "userProfile": {
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

  //------------------------------------------------saveUserProfile--------------------------------------------------------

  $('#saveUserProfile').on('click', function() {
    saveUserPro();
  });
  function saveUserPro(){
    $fh.act({
      "act": "saveUserProfileAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload":{
            "userDetails":{
              "userId" : "AC110",
              "imgUrl" : "abc.jpg",
              "firstName" : "Marky",
              "middleName" : "Michael",
              "lastName" : "Mac",
              "email" : "markymac@email.com",
              "birthday" : "1979-12-01",
              "sex" : "M",
              "address": "11 Street Address 1",
              "phone" : "312-555-1221",
              "mobile" : "312-555-1212"
            },
            "privacyPreferences" : {
              "personalInfo": {
                "PUB": true,
                "FRD": false,
                "CO": true,
                "PHY": false
              },
              "statusUpdates": {
                "PUB": true,
                "FRD": false,
                "CO": true,
                "PHY": false
              },
              "importantAlerts": {
                "PUB": true,
                "FRD": false,
                "CO": true,
                "PHY": false
              },
              "libraryHistory": {
                "PUB": true,
                "FRD": false,
                "CO": true,
                "PHY": false
              }
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




  //------------------------------------------------peachyPoints--------------------------------------------------------

  $('#peachyPoints').on('click', function() {
    peachyPoints();
  });
  function peachyPoints(){
    $fh.act({
      "act": "peachyPointsAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "peachyPoints": {
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



  //------------------------------------------------Medicine Cabinet List--------------------------------------------------------

  $('#med_cab').on('click', function() {
    med_cab();
  });
  function med_cab(){
    $fh.act({
      "act": "medicineCabinetAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload":{
            "medicineList":{
              "userId" : "AD1234"
		
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


  //------------------------------------------------Search Medicine--------------------------------------------------------

  $('#searchMed').on('click', function() {
    searchMedicine();
  });
  function searchMedicine(){
    $fh.act({
      "act": "searchMedicineAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "searchMedicine": {
              "searchTitle": "crosine"
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




  //------------------------------------------------Save Medicine--------------------------------------------------------

  $('#saveMed').on('click', function() {
    saveMedicine();
  });
  function saveMedicine(){
    $fh.act({
      "act": "saveMedicineAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "saveMedicine": {
              "userId": "AD101",
              "medicineName": "crosine"
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

  //------------------------------------------------Delete single Medicine--------------------------------------------------------

  $('#delMed').on('click', function() {
    delMedicine();
  });
  function delMedicine(){
    $fh.act({
      "act": "delMedicineAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "deleteMedicine": {
              "userId": "",
              "medicineName": ""
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



  //------------------------------------------------Delete Multiple Medicine--------------------------------------------------------

  $('#delMulMed').on('click', function() {
    delMulMedicine();
  });
  function delMulMedicine(){
    $fh.act({
      "act": "delMulMedicineAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "deleteMedicineList": {
              "userId": "",
              "medicineList": [
              {
                "medicineName" : "crosine"
              }
              ]
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
  