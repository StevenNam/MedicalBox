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
          $state.go('tab.dash')
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
              $state.go('tab.dash')
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






  .controller('DashCtrl', function ($log, $scope) {
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
  });
