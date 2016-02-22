angular.module('starter.controllers', [])

  /**
   * 名稱: SignInCtrl
   * 建立日期: 2016-02-20
   * 出現版本: 1.0
   */
  .controller('SignInCtrl', function ($log, $scope, $state, $auth, ErrorMessageService, ApiService, Validation) {
    $log.info('SignInCtrl');

    $scope.signInForm = Validation.createSignInForm();

    $scope.signIn = function () {
      $log.log($scope.signInForm);

      var message = '';
      if ($scope.signInForm.email == '') {
        message += '<li>Email Cant Empty</li><br/>';
      }
      else {
        if (!$scope.signInForm.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          message += '<li>Invalid Email Format</li><br/>';
        }
      }

      if ($scope.signInForm.password == '') {
        message += '<li>Password Cant Empty</li><br/>';
      }
      else {
        if ($scope.signInForm.password.length < 8) {
          message += '<li>Password Less Than 8 Characters</li><br/>';
        }
      }

      if (message != '') {
        ErrorMessageService.customErrorMessage('Sign In Fail', message);
        return;
      }

      ApiService.execute(
        function () {
          return $auth.submitLogin($scope.signInForm.getJSON());
        },
        function (resp) {
          $state.go('tab.home')
        },
        function (resp) {
          ErrorMessageService.customErrorMessage('Sign In Fail', 'Unauthorized User');
        }, true)
    }

  })

  /**
   * 名稱: SignUpCtrl
   * 建立日期: 2016-02-20
   * 出現版本: 1.0
   */
  .controller('SignUpCtrl', function ($log, $scope, $state, $auth, ErrorMessageService, ApiService, Validation) {
    $log.info('SignUpCtrl');

    $scope.signUpForm = Validation.createSignUpForm();

    $scope.signUp = function () {
      $log.log($scope.signUpForm);

      var message = '';
      if ($scope.signUpForm.email == '') {
        message += '<li>Email Cant Empty</li><br/>';
      }
      else {
        if (!$scope.signUpForm.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          message += '<li>Invalid Email Format</li><br/>';
        }
      }

      if ($scope.signUpForm.password == '') {
        message += '<li>Password Cant Empty</li><br/>';
      }
      else {
        if ($scope.signUpForm.password.length < 8) {
          message += '<li>Password Less Than 8 Characters</li><br/>';
        }
      }

      if ($scope.signUpForm.confirmPassword == '') {
        message += '<li>Confirm Password Cant Empty</li><br/>';
      }
      else {
        if ($scope.signUpForm.confirmPassword != $scope.signUpForm.password) {
          message += '<li>Confirm Password Not Match With Password</li><br/>';
        }
      }

      if ($scope.signUpForm.name == '') {
        message += '<li>Name Cant Empty</li><br/>';
      }

      if ($scope.signUpForm.age == '') {
        message += '<li>Age Cant Empty</li><br/>';
      }

      if (message != '') {
        ErrorMessageService.customErrorMessage('Sign Up Fail', message);
        return;
      }

      ApiService.execute(
        function () {
          return $auth.submitRegistration($scope.signUpForm.getJSON());
        },
        function (resp) {
          var signInForm = Validation.createSignInForm();
          signInForm.email = $scope.signUpForm.email;
          signInForm.password = $scope.signUpForm.password;
          ApiService.execute(
            function () {
              return $auth.submitLogin(signInForm.getJSON());
            },
            function (resp) {
              $state.go('tab.home')
            },
            function (resp) {
              ErrorMessageService.customErrorMessage('Sign In Fail', 'Unauthorized User');
            }, true)
        },
        function (resp) {
          ErrorMessageService.customErrorMessage('Sign Up Fail', 'Email Already Exists');
        }, true)
    }

  })

  .controller('HomeCtrl', function ($log, $scope, $ionicModal, ErrorMessageService, ApiService, MedicalBox) {
    $log.log('HomeCtrl');

    ApiService.execute(MedicalBox.getAllMedicalBox(), function (resp) {
        $scope.medicalBoxes = resp.data.medical_boxes;
        $log.log($scope.medicalBoxes);
      }, null, true);

    $scope.timePickerObject = {
      inputEpochTime: 0,
      titleLabel: 'Select Alert Time',
      setButtonType: 'button-balanced',  //Optional
      closeButtonType: 'button-positive',  //Optional
    };

    $ionicModal.fromTemplateUrl('addMedicalBox.html', {
      scope: $scope,
      animation: 'fade-in-scale'
    }).then(function (modal) {
      addMedicalBoxModal = modal;
    });

    $ionicModal.fromTemplateUrl('medicalBoxDetail.html', {
      scope: $scope,
      animation: 'fade-in-scale'
    }).then(function (modal) {
      $scope.medicalBoxDetailModal = modal;
    });

    $scope.openAddMedicalBoxModal = function () {
      $scope.medicalBoxForm = MedicalBox.createMedicalBoxForm();

      $scope.timePickerObject = {
        inputEpochTime: 0,
        callback: function (val) {    //Mandatory
          if (val == undefined) {
            return;
          }
          var selectedTime = new Date(val * 1000);
          if (selectedTime.getUTCHours() < 10) {
            $scope.medicalBoxForm.alert_time = '0';
          }
          $scope.medicalBoxForm.alert_time += selectedTime.getUTCHours() + ':';
          if (selectedTime.getUTCMinutes() < 10) {
            $scope.medicalBoxForm.alert_time += '0';
          }
          $scope.medicalBoxForm.alert_time += selectedTime.getUTCMinutes();
          $scope.timePickerObject.inputEpochTime = val;
          $log.log($scope.medicalBoxForm);
        }
      };

      addMedicalBoxModal.show();
    };

    $scope.openMedicalBoxDetailModal = function (id) {
      $scope.selectedMedicalBox = $scope.medicalBoxes[id];
      $scope.medicalBoxDetailModal.show();
    };

    $scope.addMedicalBox = function () {
      $log.log($scope.medicalBoxForm.getJSON());

      if ($scope.medicalBoxForm.name == '') {
        return ErrorMessageService.customErrorMessage('Create Medical Box Fail', 'Box Name Cant Empty');
      }

      ApiService.execute(MedicalBox.createMedicalBox($scope.medicalBoxForm.getJSON()),
        function (resp) {
          addMedicalBoxModal.hide();
        }, null, true);

    };

    /*var medicalBox = MedicalBox.createMedicalBoxForm();
     medicalBox.alert_time = '12:00';
     $log.log(medicalBox);
     if(medicalBox.alert_time == undefined) {
     return ErrorMessageService.customErrorMessage('Create Medical Box Fail', 'Alert Time Cant Empty');
     }
     //ApiService.execute(MedicalBox.createMedicalBox(medicalBox),
     //function (resp) {
     ApiService.execute(MedicalBox.getMedicalBoxById(1), null, null, true);
     //}, null, true);*/

  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  })

  .directive('standardTimeNoMeridian', function () {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        etime: '=etime'
      },
      template: "<strong>{{stime}}</strong>",
      link: function (scope, elem, attrs) {

        scope.stime = epochParser(scope.etime, 'time');

        function prependZero(param) {
          if (String(param).length < 2) {
            return "0" + String(param);
          }
          return param;
        }

        function epochParser(val, opType) {
          if (val === null) {
            return "00:00";
          } else {
            if (opType === 'time') {
              var hours = parseInt(val / 3600);
              var minutes = (val / 60) % 60;

              return (prependZero(hours) + ":" + prependZero(minutes));
            }
          }
        }

        scope.$watch('etime', function (newValue, oldValue) {
          scope.stime = epochParser(scope.etime, 'time');
        });

      }
    };
  })
;
