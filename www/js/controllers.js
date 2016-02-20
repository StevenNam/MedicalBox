angular.module('starter.controllers', [])

  .controller('SignInCtrl', function ($log, $scope, $state, $auth, ErrorMessageService, ApiService, Validation) {
    $log.info('SignInCtrl');

    $scope.signInForm = Validation.createSignForm();

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
          ErrorMessageService.customErrorMessage('Sign In Fail', 'b');
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
