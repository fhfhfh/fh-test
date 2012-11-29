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


  //-------------------------------------------------------Reminder Medication---------------------------

  $('#reminderMed').on('click', function() {
    reminderMedicine();
  });
  function reminderMedicine(){
    $fh.act({
      "act": "addReminderAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "addReminder": {
              "userId": "AD1234",
              "madicationName": "ABC",
              "startDate": "10-12-2012",
              "alertCategory": "",
              "recurring": "",
              "notify": "sms/email/alarm",
              "comments": "take medication…"
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




  //-------------------------------------------------------Reminder List-------------------------------------------------------

  $('#reminderList').on('click', function() {
    reminderList();
  });
  function reminderList(){
    $fh.act({
      "act": "fetchReminderAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "reminderList": {
          //EMPTY
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


  //-------------------------------------------------------Reminder List-------------------------------------------------------

  $('#diagnosisList').on('click', function() {
    diagnosisList();
  });
  function diagnosisList(){
    $fh.act({
      "act": "fetchDiagnosisListAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "diagnosis": {
              "userId": "AD101"
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


  //-------------------------------------------------------Fetch Test Result List-------------------------------------------------------

  $('#testResultList').on('click', function() {
    testResultList();
  });
  function testResultList(){
    $fh.act({
      "act": "fetchTestResultListAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "testResult": {
              "userId": "AD101"
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

  //-------------------------------------------------------Filter Content-------------------------------------------------------

  $('#filterContent').on('click', function() {
    filterContent();
  });
  function filterContent(){
    $fh.act({
      "act": "filterContentAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "filterContent": {
              "category": "visits/procedure/diagnosis/test result",
              "sortBy": "date ascending/ date descending/alphabetical order/content type ",
              "startDate": "2012-12-11",
              "endDate": "2012-12-15"
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



  //-------------------------------------------------------medicalHistory -------------------------------------------------------

  medReq = {
    "request": {
      "head": {
        "sessionId": "4860-9e4b-3ca8d2cb3df7"
      },
      "payload": {
        "medicalHistory":{
          "userId": "AD101"
        }
      }
    }
  }
      
  $('#medicalHistory').on('click', function() {
    medicalHistory();
  });
  function medicalHistory(){
    $fh.act({
      "act": "fetchMedicalHistoryAction",
      // my cloud function name to call
      "req": medReq
    }, function(res) {
      // Cloud call was successful. Alert the response
      alert('Got response from cloud:' + JSON.stringify(res));
    }, function(msg, err) {
      // An error occured during the cloud call. Alert some debugging information
      alert('Cloud call failed with error:' + msg + '. Error properties:' + JSON.stringify(err));
    });
  }


  //-------------------------------------------------------searchAllergy -------------------------------------------------------


      
  $('#searchAllergy').on('click', function() {
    searchAllergy();
  });
  function searchAllergy(){
    $fh.act({
      "act": "searchAllergyAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "searchAllergy": {
              "searchTitle" : "peanut",
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



  //-------------------------------------------------------addAllergy -------------------------------------------------------


      
  $('#addAllergy').on('click', function() {
    addAllergy();
  });
  function addAllergy(){
    $fh.act({
      "act": "addAllergyAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "addAllergy": {
              "userId": "AB110",
              "allergyName": "peanut"
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




 //-------------------------------------------------------fetchFeaturedContent -------------------------------------------------------


      
  $('#fetchFeaturedContent').on('click', function() {
    fetchFeaturedContent();
  });
  function fetchFeaturedContent(){
    $fh.act({
      "act": "fetchFeaturedContentAction",
      // my cloud function name to call
      "req": {
        "request": {
          "head": {
            "sessionId": "4860-9e4b-3ca8d2cb3df7"
          },
          "payload": {
            "addAllergy": {
              "userId": "AB110",
              "allergyName": "peanut"
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
  