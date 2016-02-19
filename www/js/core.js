/**
 * 名稱: Core.js
 * 建立者: Steven Name
 * 建立日期: 2016-01-16
 * 版本號: 1.0
 */

angular.module('AppCore', [])

  /**
   * 名稱: LoadingService
   * 建立日期: 2016-01-16
   * 出現版本: 1.0
   */
  .factory('LoadingService', function ($ionicLoading) {
    return {

      /**
       * 顯示載入圖示
       */
      startLoading: function () {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
      },

      /**
       * 關閉載入圖示
       */
      stopLoading: function () {
        $ionicLoading.hide();
      }
    }
  })

  /**
   * 名稱: ErrorMessageService
   * 建立日期: 2016-01-16
   * 出現版本: 1.0
   * 需求插件: angular-translate
   */
  /*.factory('ErrorMessageService', ['$ionicPopup', '$translate', function ($ionicPopup, $translate) {

   /!**
   * 網絡問題標題
   *!/
   var connectionErrorHeader;
   $translate('ERROR_MESSAGE.CONNECTION_ERROR.HEADER').then(function (header) {
   connectionErrorHeader = header;
   });

   /!**
   * 網絡問題信息
   *!/
   var connectionErrorMessage;
   $translate('ERROR_MESSAGE.CONNECTION_ERROR.MESSAGE').then(function (message) {
   connectionErrorMessage = message;
   });

   /!**
   * 請求內容錯誤標題
   *!/
   var notAcceptableErrorHeader;
   $translate('ERROR_MESSAGE.NOT_ACCEPTABLE_ERROR.HEADER').then(function (header) {
   notAcceptableErrorHeader = header;
   });

   /!**
   * 請求內容錯誤信息
   *!/
   var notAcceptableErrorMessage;
   $translate('ERROR_MESSAGE.NOT_ACCEPTABLE_ERROR.MESSAGE').then(function (message) {
   notAcceptableErrorMessage = message;
   });

   /!**
   * 確認按鈕
   *!/
   var buttonOK;
   $translate('ERROR_MESSAGE.BUTTON_OK').then(function (text) {
   buttonOK = text;
   })

   /!**
   * 建立錯誤信息
   * @param header 錯誤信息標題
   * @param message 錯誤信息內容
   * @returns 錯誤信息
   * @private
   *!/
   var _customErrorMessage = function (header, message) {
   return $ionicPopup.alert(
   {
   title: header,
   template: message,
   buttons: [{
   text: buttonOK,
   type: 'button-default'
   }]
   });
   }

   return {

   /!**
   * 建立自定義錯誤信息
   * @param header 錯誤信息標題
   * @param message 錯誤信息內容
   * @returns 錯誤信息
   *!/
   customErrorMessage: function (header, message) {
   return _customErrorMessage(header, message);
   },

   /!**
   * 建立網絡錯誤信息
   * @returns 網絡錯誤信息
   *!/
   networkErrorMessage: function () {
   return _customErrorMessage(connectionErrorHeader, connectionErrorMessage);
   },

   /!**
   * 建立後台請求內容錯誤信息
   * @returns 後台請求內容錯誤信息
   *!/
   notAcceptableErrorMessage: function () {
   return _customErrorMessage(notAcceptableErrorHeader, notAcceptableErrorMessage);
   }

   }
   }])*/

  /**
   * 名稱: PromiseService
   * 建立日期: 2016-01-17
   * 出現版本: 1.0
   */
  .factory('PromiseService', function () {
    return {

      /**
       * 處理PROMISE
       * @param promise PROMISE
       * @param success_callback 成功時執行函數
       * @param error_callback 失敗時執行函數
       */
      process: function (promise, success_callback, error_callback) {
        if (success_callback != undefined) {
          promise.then(success_callback);
        }

        if (error_callback != undefined) {
          promise.catch(error_callback);
        }
      }

    }
  })

  /**
   * 名稱: ApiService
   * 建立日期: 2016-01-16
   * 出現版本: 1.0
   */
  .factory('ApiService', function ($log, LoadingService, PromiseService) {

    /**
     * 處理後台請求返回結果
     * @param promise 請求返回結果
     * @param success_callback 成功時執行函數
     * @param error_callback 失敗時執行函數
     * @private
     */
    var _processResult = function (promise, success_callback, error_callback) {
      promise
        .then(function (resp) {
          $log.log('Data: ', resp.data);
          $log.debug('HTTP Success: ', resp);
        })
        .catch(function (resp) {
          $log.debug('HTTP Fail: ', resp);
        })

      PromiseService.process(promise, success_callback, error_callback);
    }

    return {

      /**
       * 處理後台請求返回結果
       * @param promise 請求返回結果
       * @param success_callback 成功時執行函數
       * @param error_callback 失敗時執行函數
       */
      processResult: function (promise, success_callback, error_callback) {
        _processResult(promise, success_callback, error_callback);
      },

      /**
       * 執行後台請求
       * @param api 後台請求
       * @param success_callback 成功時執行函數
       * @param error_callback 失敗時執行函數
       * @param is_need_loading 載入功能識別
       */
      execute: function (api, success_callback, error_callback, is_need_loading) {
        if (is_need_loading) {
          LoadingService.startLoading();
        }

        var promise = api.apply(this);
        promise.finally(function (resp) {
          if (is_need_loading) {
            LoadingService.stopLoading();
          }
        })

        _processResult(promise, success_callback, error_callback);

      },
    }
  })

  /**
   * 名稱: TabService
   * 建立日期: 2016-01-16
   * 出現版本: 1.0
   */
  .factory('TabService', function ($log) {

    /**
     * 分頁控製器
     * @param tabCount 分頁數目
     * @constructor
     */
    function TabController(tabCount) {

      this.selectedTabIndex = 1;

      /**
       * 分頁CSS
       * @type {Array}
       */
      this.tabsCSS = [];

      /**
       * 分頁函數
       * @type {Array}
       */
      this.callback = []

      /**
       * 初始化分頁
       */
      for (i = 0; i < tabCount; i++) {
        this.tabsCSS[i] = '';
        this.callback[i] = undefined;
      }
      this.tabsCSS[0] = 'tab-item-active';

      /**
       * 選擇分頁
       * @param tabIndex 分頁ID
       */
      this.selectTab = function (tabIndex) {

        this.selectedTabIndex = tabIndex;

        for (i = 0; i < tabCount; i++) {
          if (i == tabIndex) {
            this.tabsCSS[i] = 'tab-item-active'
          }
          else {
            this.tabsCSS[i] = '';
          }
        }

        if (this.callback[tabIndex] != undefined) {
          this.callback[tabIndex].apply();
        }
      }

      /**
       * 設定分頁函數
       * @param tabIndex 分頁ID
       * @param callback 分頁函數
       */
      this.setTabCallback = function (tabIndex, callback) {
        this.callback[tabIndex] = callback;
      }

    }

    return {

      /**
       * 建立分頁函數
       * @param tabCount 分頁數目
       * @returns {TabController}
       */
      createTabController: function (tabCount) {
        return new TabController(tabCount);
      }

    }

  })

  /**
   * 名稱: ExternalAppService
   * 建立日期: 2016-01-17
   * 出現版本: 1.0
   * 需求插件: cordovaAppAvailability, cordovaInAppBrowser
   */
  /*.factory('ExternalAppService', function ($log, $cordovaAppAvailability, $cordovaInAppBrowser, PromiseService) {

   /!**
   * 檢查應用是否已安裝
   * @param iosScheme IOS應用SCHEME
   * @param androidScheme ANDROID 應用SCHEME
   * @param success_callback 成功時執行函數
   * @param error_callback 失敗時執行函數
   * @private
   *!/
   var _check = function (iosScheme, androidScheme, success_callback, error_callback) {
   var scheme;
   if (ionic.Platform.isAndroid()) {
   scheme = androidScheme;                                                                                     // ANDROID SCHEME
   }
   else if (ionic.Platform.isIOS()) {
   scheme = iosScheme;                                                                                         // IOS SCHEME
   }


   PromiseService.process($cordovaAppAvailability.check(scheme), success_callback, error_callback);
   }

   return {

   /!**
   * 檢查應用是否已安裝
   * @param iosScheme IOS應用SCHEME
   * @param androidScheme ANDROID 應用SCHEME
   * @param success_callback 成功時執行函數
   * @param error_callback 失敗時執行函數
   *!/
   check: function (iosScheme, androidScheme, success_callback, error_callback) {
   _check(iosScheme, androidScheme, success_callback, error_callback);
   },

   /!**
   * 開啟外部應用
   * @param iosScheme IOS應用SCHEME
   * @param androidSceme ANDROID 應用SCHEME
   * @param url URL
   *!/
   openApp: function (iosScheme, androidSceme, url) {
   _check(iosScheme, androidSceme,
   function (resp) {
   $cordovaInAppBrowser.open(url, '_system');
   },
   function (resp) {
   $cordovaInAppBrowser.open(url, '_system');
   })
   }

   }
   })*/

  /**
   * 名稱: ImageService
   * 建立日期: 2016-01-17
   * 出現版本: 1.0
   * 需求插件: cordovaCamera, cordovaImagePicker, cordovaFile
   */
  /*.factory('ImageService', function ($cordovaCamera, $cordovaImagePicker, $cordovaFile) {

   return {

   /!**
   * 拍照
   * @param options 相機參數
   * @param success_callback 成功時執行函數
   * @param error_callback 失敗時執行函數
   *!/
   takePhoto: function (options, success_callback) {
   $cordovaCamera.getPicture(options).then(success_callback);
   },

   /!**
   * 選擇裝置內儲存的照片
   * @param options 照片參數
   * @param success_callback 成功時執行函數
   * @param error_callback 失敗時執行函數
   *!/
   getPhoto: function (options, success_callback) {
   $cordovaImagePicker.getPictures(options).then(function (results) {
   console.log('Files: ', results);
   if (ionic.Platform.isAndroid()) {
   // ANDROID 裝置流程
   console.log('Is Android Device: ', ionic.Platform.isAndroid());
   console.info('Selected Image: ', results[0].substr(results[0].indexOf('cache') + 6))
   $cordovaFile.readAsDataURL(cordova.file.cacheDirectory, results[0].substr(results[0].indexOf('cache') + 6))
   .then(success_callback);
   }
   else if (ionic.Platform.isIOS()) {
   // IOS 裝置流程
   console.log('Is IOS Device: ', ionic.Platform.isIOS());
   console.info('Selected Image: ', results[0].substr(results[0].indexOf('tmp') + 4))
   $cordovaFile.readAsDataURL(cordova.file.tempDirectory, results[0].substr(results[0].indexOf('tmp') + 4))
   .then(success_callback);
   }

   }, function (error) {

   });
   }

   }
   })*/

  /**
   * 名稱: LazyLoadingService
   * 建立日期: 2016-01-18
   * 出現版本: 1.0
   */
  .factory('LazyLoadingService', function ($log, ApiService) {

    /**
     * 懶加載控製器
     * @constructor
     */
    function LazyLoadingController() {

      /**
       * 完成所有載入識別
       * @type {boolean}
       */
      var noMoreElement = true;

      /**
       * 懶加載完成識別
       * @type {boolean}
       */
      var loadingComplete = true;

      /**
       * 載入更多數據
       * @param dataContainer 數據容器
       * @param api 執行的API
       * @param maxDataReceive 最大數據返回數目
       */
      this.loadMoreElement = function (dataContainer, api, maxDataReceive, is_need_loading) {

        if (dataContainer.length != 0) {
          if (dataContainer.length < maxDataReceive) {
            noMoreElement = true;
          }
          else {
            if (loadingComplete == true) {                                                                            // 檢查上一次執行是否完成，未完成返回
              loadingComplete = false;

              ApiService.execute(api,
                function (resp) {
                  if (resp.data.length != maxDataReceive) {
                    noMoreElement = true;
                  }

                  for (i = 0; i < resp.data.length; i++) {
                    dataContainer.push(resp.data[i]);                                                                 // 加入List
                  }
                  loadingComplete = true;                                                                             // 載入完成
                },
                function (resp) {
                }, is_need_loading);
            }
          }
        }
      }

      /**
       * 檢查是否已經載入所有數據
       * @returns {boolean}
       */
      this.noMoreElements = function () {
        return noMoreElement;
      }

      /**
       * 啟用控製器
       */
      this.enable = function () {
        noMoreElement = false;
      }

      /**
       * 停用控製器
       */
      this.disable = function () {
        noMoreElement = true;
      }
    }

    return {

      /**
       * 建立懶加載控製器
       * @returns {LazyLoadingController}
       */
      createLazyLoadingController: function () {
        return new LazyLoadingController();
      }

    }
  })

  /**
   * 名稱: HardwareBackButtonService
   * 建立日期: 2016-01-24
   * 出現版本: 1.0
   */
  .factory('HardwareBackButtonService', function ($log, $ionicPlatform) {

    var deregister = undefined;

    return {

      /**
       * 關閉後退鍵
       * @param num
       */
      disable: function (num) {
        $log.log('HardwareBackButtonManager -> Disable');
        deregister = $ionicPlatform.registerBackButtonAction(function (e) {
          e.preventDefault();
          return false;
        }, num);
      },

      /**
       * 啟用後退鍵
       * @param num
       */
      enable: function () {
        if (deregister !== undefined) {
          $log.log('HardwareBackButtonManager -> Enable');
          deregister();
          deregister = undefined;
        }
      }

    }

  })
;

