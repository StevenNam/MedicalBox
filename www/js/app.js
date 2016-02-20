angular.module('starter',
  [
    'ionic',
    'ng-token-auth',
    'restangular',
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
    url: '/development_api'
  })

  .config(function ($stateProvider,
                    $urlRouterProvider,
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


    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.chats', {
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
      })

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
    $urlRouterProvider.otherwise('/tab/dash');

  });
