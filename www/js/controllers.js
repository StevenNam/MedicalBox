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

  .controller('HomeCtrl', function ($log, $rootScope, $scope, $ionicModal, $timeout, $ionicPlatform, $cordovaLocalNotification, $ionicPopup,
                                    ErrorMessageService, ApiService, MedicalBox, Drug, OpenFDA) {

    $log.log('HomeCtrl');

    ApiService.execute(MedicalBox.getAllMedicalBox(), function (resp) {
      $scope.medicalBoxes = resp.data.medical_boxes;
    }, null, true);

    $scope.timePickerObject = {
      inputEpochTime: 0,
      titleLabel: 'Select Alert Time',
      setButtonType: 'button-balanced',  //Optional
      closeButtonType: 'button-positive',  //Optional
    };

    /**
     * Timer 設定
     */
    $scope.search = {
      query: ''
    };
    var typingTimer = null;                                                                                           // timer identifier
    var doneTypingInterval = 1000;                                                                                    // time in ms, 3 second for example

    $ionicPlatform.ready(function () {
      $rootScope.$on('$cordovaLocalNotification:schedule',
        function (event, notification, state) {
          //$log.log('New Notification: ', notification);
        });

      $rootScope.$on('$cordovaLocalNotification:clear',
        function (event, notification, state) {
        });

      /*$rootScope.$on('$cordovaLocalNotification:trigger',
       function (event, notification, state) {
       $log.log('Triggered Notification: ', notification);
       });*/
    })

    $ionicModal.fromTemplateUrl('addMedicalBox.html', {
      scope: $scope,
      animation: 'fade-in-scale'
    }).then(function (modal) {
      $scope.addMedicalBoxModal = modal;
    });

    $ionicModal.fromTemplateUrl('updateMedicalBox.html', {
      scope: $scope,
      animation: 'fade-in-scale'
    }).then(function (modal) {
      $scope.updateMedicalBoxModal = modal;
    });

    $ionicModal.fromTemplateUrl('medicalBoxDetail.html', {
      scope: $scope,
      animation: 'fade-in-scale'
    }).then(function (modal) {
      $scope.medicalBoxDetailModal = modal;
    });

    $ionicModal.fromTemplateUrl('addDrug.html', {
      scope: $scope,
      animation: 'fade-in-scale'
    }).then(function (modal) {
      $scope.addDrugModal = modal;
    });

    $ionicModal.fromTemplateUrl('selectDrug.html', {
      scope: $scope,
      animation: 'fade-in-scale'
    }).then(function (modal) {
      $scope.selectDrugModal = modal;
    });

    $scope.openAddMedicalBoxModal = function () {
      $scope.medicalBoxForm = MedicalBox.createMedicalBoxForm();

      $scope.timePickerObject = {
        inputEpochTime: 0,
        step: 1,
        callback: function (val) {    //Mandatory
          if (val == undefined) {
            return;
          }
          var selectedTime = new Date(val * 1000);
          if (selectedTime.getUTCHours() < 10) {
            $scope.medicalBoxForm.alert_time = '0';
          }
          else {
            $scope.medicalBoxForm.alert_time = '';
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

      $scope.addMedicalBoxModal.show();
    };

    $scope.openMedicalBoxDetailModal = function (id) {
      $scope.selectedMedicalBox = $scope.medicalBoxes[id];
      $log.log('Selected Medical Box: ', $scope.selectedMedicalBox);
      $scope.medicalBoxDetailModal.show();
    };

    $scope.openUpdateMedicalBoxModal = function (index) {
      $scope.index = index;
      ApiService.execute(MedicalBox.getMedicalBoxById($scope.medicalBoxes[index].id),
        function (resp) {
          $scope.selectedMedicalBox = resp.data;
          date = new Date('2015-02-22 ' + $scope.selectedMedicalBox.alert_time + ':00');
          $scope.timePickerObject = {
            inputEpochTime: date.getHours() * 60 * 60 + date.getMinutes() * 60,
            callback: function (val) {    //Mandatory
              if (val == undefined) {
                return;
              }
              var selectedTime = new Date(val * 1000);
              if (selectedTime.getUTCHours() < 10) {
                $scope.selectedMedicalBox.alert_time = '0';
              }
              else {
                $scope.selectedMedicalBox.alert_time = '';
              }
              $scope.selectedMedicalBox.alert_time += selectedTime.getUTCHours() + ':';
              if (selectedTime.getUTCMinutes() < 10) {
                $scope.selectedMedicalBox.alert_time += '0';
              }
              $scope.selectedMedicalBox.alert_time += selectedTime.getUTCMinutes();
              $scope.timePickerObject.inputEpochTime = val;
            }
          };
        }, null, true);

      $scope.updateMedicalBoxModal.show();
    };

    $scope.openAddDrugModal = function () {
      $scope.drugForm = Drug.createDrugForm();

      $scope.addDrugModal.show();
    };

    $scope.openSelectDrugModal = function () {
      $scope.query = '';
      $scope.selectDrugModal.show();
    };

    $scope.addMedicalBox = function () {
      $log.log($scope.medicalBoxForm.getJSON());

      if ($scope.medicalBoxForm.name == '') {
        return ErrorMessageService.customErrorMessage('Create Medical Box Fail', 'Box Name Cant Empty');
      }

      ApiService.execute(MedicalBox.createMedicalBox($scope.medicalBoxForm.getJSON()),
        function (resp) {
          $ionicPlatform.ready(function () {
            if (resp.data.frequency == 'Every Day') {
              var every = 'minute';
            }
            else {
              var every = '';
            }

            var now = new Date();
            var alert_time = new Date(now.getTime());
            alert_time.setHours(resp.data.alert_time.split(':')[0]);
            alert_time.setMinutes(resp.data.alert_time.split(':')[1]);
            alert_time.setSeconds(0);

            if (alert_time.getTime() <= now.getTime()) {
              $log.log('Alert time delays to next day');
              alert_time.setDate(alert_time.getDate() + 1);
              $log.log('Now: ', now);
              $log.log('Alert Time: ', alert_time);
            }

            $cordovaLocalNotification.schedule({
              id: resp.data.id,
              title: resp.data.name,
              text: '',
              at: alert_time,
              every: every
            }).then(function (resp) {
              $cordovaLocalNotification.getAll()
                .then(function (resp) {
                  $log.log('All Notification: ', resp);
                })
            });

          })

          $scope.medicalBoxes.push(resp.data);
          $scope.addMedicalBoxModal.hide();
        }, null, true);
    };

    $scope.updateMedicalBox = function () {
      if ($scope.selectedMedicalBox.name == '') {
        return ErrorMessageService.customErrorMessage('Create Medical Box Fail', 'Box Name Cant Empty');
      }

      ApiService.execute(MedicalBox.updateMedicalBoxById($scope.selectedMedicalBox),
        function (resp) {
          $ionicPlatform.ready(function () {
            if (resp.data.frequency == 'Every Day') {
              var every = 'minute';
            }
            else {
              var every = '';
            }

            var now = new Date();
            var alert_time = new Date(now.getTime());
            alert_time.setHours(resp.data.alert_time.split(':')[0]);
            alert_time.setMinutes(resp.data.alert_time.split(':')[1]);
            alert_time.setSeconds(0);
            if (alert_time.getTime() <= now.getTime()) {
              $log.log('Alert time delays to next day');
              alert_time.setDate(alert_time.getDate() + 1);
              $log.log('Now: ', now);
            }

            $cordovaLocalNotification.update({
              id: resp.data.id,
              title: resp.data.name,
              at: alert_time,
              every: every
            }).then(function (resp) {
              $log.log('Update Notification: ', resp);
              $cordovaLocalNotification.getAll()
                .then(function (resp) {
                  $log.log('All Notification: ', resp);
                })
            })
          });

          $scope.medicalBoxes[$scope.index] = resp.data;
          $scope.updateMedicalBoxModal.hide();
        }, null, true);
    };

    $scope.deleteMedicalBox = function (index) {
      ApiService.execute(MedicalBox.deleteMedicalBoxById($scope.medicalBoxes[index].id),
        function (resp) {
          $cordovaLocalNotification.cancel($scope.medicalBoxes[index].id)
            .then(function (resp) {
              $log.log('Clear Notification: ', resp);
              $cordovaLocalNotification.getAll()
                .then(function (resp) {
                  $log.log('All Notification: ', resp);
                })
            });
          $scope.medicalBoxes.splice(index, 1);
        }, null, true);
    };

    $scope.copyMedicalBox = function (id) {
      ApiService.execute(MedicalBox.copyMedicalBoxById(id),
        function (resp) {
          $ionicPlatform.ready(function () {
            if (resp.data.frequency == 'Every Day') {
              var every = 'minute';
            }
            else {
              var every = '';
            }

            var now = new Date();
            var alert_time = new Date(now.getTime());
            alert_time.setHours(resp.data.alert_time.split(':')[0]);
            alert_time.setMinutes(resp.data.alert_time.split(':')[1]);
            alert_time.setSeconds(0);

            if (alert_time.getTime() <= now.getTime()) {
              $log.log('Alert time delays to next day');
              alert_time.setDate(alert_time.getDate() + 1);
              $log.log('Now: ', now);
              $log.log('Alert Time: ', alert_time);
            }

            $cordovaLocalNotification.schedule({
              id: resp.data.id,
              title: resp.data.name,
              text: '',
              at: alert_time,
              every: every
            }).then(function (resp) {
              $cordovaLocalNotification.getAll()
                .then(function (resp) {
                  $log.log('All Notification: ', resp);
                })
            });
          })
          $scope.medicalBoxes.push(resp.data);
        }, null, true);
    };

    $scope.addDrug = function () {
      $log.log($scope.drugForm.getJSON());

      if ($scope.drugForm.name == '' || $scope.drugForm.name == undefined) {
        return ErrorMessageService.customErrorMessage('Select Drug Fail', 'Drug Name Cant Empty');
      }

      if ($scope.drugForm.amount == 0) {
        return ErrorMessageService.customErrorMessage('Select Drug Fail', 'Amount Cant Be Zero');
      }

      ApiService.execute(Drug.createDrug($scope.selectedMedicalBox.id, $scope.drugForm.getJSON()),
        function (resp) {
          $scope.selectedMedicalBox.drugs.push(resp.data);
          $scope.addDrugModal.hide();
        }, null, true);
    };

    $scope.deleteDrug = function (index) {
      ApiService.execute(Drug.deleteDrugById($scope.selectedMedicalBox.id, $scope.selectedMedicalBox.drugs[index].id),
        function (resp) {
          $scope.selectedMedicalBox.drugs.splice(index, 1);
        }, null, true);
    };

    $scope.searchDrugByName = function () {
      if (typingTimer != null) {
        $timeout.cancel(typingTimer);                                                                                 // 清除timer
      }

      typingTimer = $timeout(
        function () {
          $log.log($scope.search.query);

          ApiService.execute(OpenFDA.searchDrugsByGenericName($scope.search.query),
            function (resp) {
              $scope.drugs = resp.data.results;
              $log.log($scope.drugs);
            },
            function (resp) {
              if (resp.status == 404) {
                ErrorMessageService.customErrorMessage('Search Drug By Name', 'No match found');
              }
            })

        }, doneTypingInterval
      );
    };

    $scope.selectDrug = function (drugName) {
      $scope.drugForm.name = drugName;

      ApiService.execute(OpenFDA.searchReactionByGenericName(drugName),
        function (resp) {
          var sideEffect = '';
          for (i = 0; i < resp.data.results.length; i++) {
            sideEffect += '<li>' + resp.data.results[i].term + '</li>';
          }

          $ionicPopup.alert({
            title: '<b class="assertive">Side Effect Of Drug</b>',
            template: sideEffect,
            buttons: [{
              text: 'Confirm',
              type: 'button-assertive'
            }]
          })
        }, null, true);
      $scope.selectDrugModal.hide();
    };
  })


  /*.controller('ChatsCtrl', function ($scope, Chats) {
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
  })*/

  /*.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
   $scope.chat = Chats.get($stateParams.chatId);
   })*/

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
