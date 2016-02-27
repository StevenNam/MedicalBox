angular.module('starter',
  [
    'ionic',
    'ng-token-auth',
    'restangular',
    'ngCordova',
    'ionic-timepicker',
    'AppCore',
    'starter.controllers',
    'starter.services'
  ])

  .run(function ($log, $ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });
  })

  // API 設定
  .constant('API', {
    //url: '/development_api'
    url: 'http://192.168.1.103:3000'
  })

  .config(function ($stateProvider,
                    $urlRouterProvider,
                    $ionicConfigProvider,
                    $authProvider,
                    RestangularProvider,
                    API) {

    // ng-token-auth 設定
    $authProvider.configure({
      apiUrl: API.url,                                                                                                // API URL
      storage: 'localStorage'                                                                                         // 儲存方式
    })

    // Restangular 設定
    RestangularProvider.setBaseUrl(API.url);                                                                          // 設定 API 路徑
    //RestangularProvider.setDefaultHttpFields({cache: true});
    RestangularProvider.setRestangularFields({etag: 'Etag'});
    RestangularProvider.setDefaultHeaders({'Accept': "application/json", 'If-Modified-Since': undefined});            // 設定 HTTP 請求預設 HEADER
    RestangularProvider.setFullResponse(true);

    $ionicConfigProvider.tabs.position('bottom');                                                                   // 設定分頁插件於頁面最低位置
    //$ionicConfigProvider.views.transition('none');                                                                // 關閉分頁轉換動畫

    $stateProvider

    // 驗證用戶
      .state('validate', {
        url: '/validate',
        templateUrl: 'templates/validation.html',
        //controller: 'LanguageCtrl',
        onEnter: function ($log, $state, $auth, ApiService) {
          $log.info('Enter Page: validation.html');

          ApiService.execute(
            function () {
              return $auth.validateUser();
            },
            function () {
              $state.go('tab.home');
            },
            function () {
              $state.go('signIn');
            }, true)
        }
      })

      // 用戶登入
      .state('signIn', {
        url: '/signIn',
        templateUrl: 'templates/sign-in.html',
        controller: 'SignInCtrl',
        onEnter: function ($log) {
          $log.info('Enter Page: sign-in.html');
        }
      })

      // 用戶註冊
      .state('signUp', {
        url: '/signUp',
        templateUrl: 'templates/sign-up.html',
        controller: 'SignUpCtrl',
        onEnter: function ($log) {
          $log.info('Enter Page: sign-up.html');
        }
      })

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('tab.home', {
        url: '/home',
        views: {
          'tab-dash': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        },
        onEnter: function ($log) {
          $log.info('Enter Page: Home.html');
        }
      })




      /*.state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })*/

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/validate');

  });
