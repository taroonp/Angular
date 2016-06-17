var app = angular.module('appName', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'ngMask', 'ui.bootstrap', 'ngAnimate', 'ngIdle', 'uiSwitch']);

app.provider("digiRoute", function () {
    
    var values = {
        home: '/',
        cliniclist: '/cliniclist',
        prescriberdetails: '/prescriberdetails/:prescriberid',
        prescriber_info: '/prescriberinfo/:prescriberid',
        prescriber_address: '/prescriberaddress/:prescriberid',
        surescript_details: '/surescriptdetails/:prescriberid',
        creditcard_validation: '/creditcardvalidation/:prescriberid',
        register_tokens: '/registertokens/:prescriberid',
        changepwd: '/changePwd/:email/:id/:token',
        prescriberslist: '/prescribers',
        forgotpassword: '/forgotpassword',
        clinicInfo: '/clinicInfo'
    };

    var _getURL = function (index) {
        var url = null;
        switch (index) {
            case 1:
                url = values.prescriber_info;
                break;
            case 2:
                url = values.prescriber_address;
                break;
            case 3:
                url = values.surescript_details;
                break;
            case 4:
                url = values.creditcard_validation;
                break;
            case 5:
                url = values.register_tokens;
                break;
        }
        return url;
    }

    return {
        path: values,
        $get: function () {
            return { getURL: _getURL, path: values }
        }
    };
});

app.config(['$routeProvider', 'digiRouteProvider', '$locationProvider', 'IdleProvider', 'KeepaliveProvider', function ($routeProvider, digiRoute, $locationProvider, IdleProvider, KeepaliveProvider) {

    $locationProvider.html5Mode(true);
    

    $routeProvider.when(digiRoute.path.home, {
        controller: "homeController",
        templateUrl: "app/views/home.html",
        resolve: { "check": validateAccess }
    });

    $routeProvider.when(digiRoute.path.cliniclist, {
        controller: "ClinicListController",
        templateUrl: "app/views/ClinicList.html",
        resolve: { "check": validateAccess }
    });


    $routeProvider.when(digiRoute.path.prescriberdetails, {
        //controller: "prescriberdetailsController",
        templateUrl: "app/views/IdentityProofingIndex.html",
        resolve: { "check": validateAccess }
    });

    $routeProvider.when(digiRoute.path.prescriber_info, {
        //controller: "PrescriberInfoController",
        //controller:"prescriberdetailsController",
        templateUrl: "app/views/PrescriberInfo.html",
        resolve: { "check": validateAccess }
    });

    $routeProvider.when(digiRoute.path.prescriber_address, {
        //controller: "PrescriberAddressController",
        //controller: "prescriberdetailsController",
        templateUrl: "app/views/PrescriberAddress.html",
        resolve: { "check": validateAccess }
    });

    $routeProvider.when(digiRoute.path.surescript_details, {
        //controller: "SureScriptDetailController",
        //controller: "prescriberdetailsController",
        templateUrl: "app/views/SureScriptDetail.html",
        resolve: { "check": validateAccess }
    });

    $routeProvider.when(digiRoute.path.creditcard_validation, {
        controller: "CreditCardValidationController",
        templateUrl: "app/views/CreditCardValidation.html",
        resolve: { "check": validateAccess }
    });

    $routeProvider.when(digiRoute.path.register_tokens, {
        controller: "RegisterTokensController",
        templateUrl: "app/views/RegisterTokens.html",
        resolve: { "check": validateAccess }
    });

    $routeProvider.when(digiRoute.path.changepwd, {
        controller: "changePwdController",
        templateUrl: "app/views/changePwd.html"
    });

    $routeProvider.when(digiRoute.path.prescriberslist, {
        controller: "PrescribersListController",
        templateUrl: "app/views/PrescribersList.html",
        resolve: { "check": validateAccess }
    });

    $routeProvider.when(digiRoute.path.forgotpassword, {
        controller: "forgotPasswordController",
        templateUrl: "app/views/forgotPassword.html"
    });

    $routeProvider.when(digiRoute.path.clinicInfo, {
        controller: "clinicInfoController",
        templateUrl: "app/views/ClinicInfo.html"
    });
    


    $routeProvider.when(digiRoute.path.PageNotFound, {
        templateUrl: "app/views/404error.html"
    });


    $routeProvider.when('/home', {
        redirectTo: '/'
    });

    $routeProvider.otherwise({ redirectTo: "/pageNotFound" });

    // configure Idle settings
    IdleProvider.idle(1200); // in seconds
    IdleProvider.timeout(300); // in seconds
    //KeepaliveProvider.interval(2); // in seconds

    function validateAccess($location, $q, InitFactory, $route, authService, $rootScope) {
        
        $rootScope.showClinicBanner = false;
        if (!authService.userDetail.isAuth) {
            $location.path('/');
        } else if ($location.path().startsWith("/prescriberdetails")) {
            $rootScope.showClinicBanner = true;
            return InitFactory.initDashboardData($route.current.params.prescriberid);
        } else if ($location.path().startsWith("/prescribers")) {
            $rootScope.showClinicBanner = true;
        }
        //else if ($location.path('/')) {
        //    if (authService.userDetail.role == 'admin') {
        //        $location.path('/prescriberlist');
        //    } else {
        //        //return InitFactory.initDashboardData(authService.userDetail.prescriberid);
        //        $location.path('/prescriberdetails/' + authService.userDetail.prescriberid);
        //    }
        //}

    }
}]);

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

//Define service constant
var isTestingEnv = false;
var appType = '';
var serviceBase = '';

// @if NODE_ENV='staging'
serviceBase = 'https://remotedigidms.com/identity_proofing/';
//@endif

// @if NODE_ENV='prod'
serviceBase = 'https://www.webdigidms.com/idproofing/';
//@endif

// @if NODE_ENV='dev'
serviceBase = 'http://localhost:52069/';
//@endif


app.constant('ngAuthSettings', { apiServiceURL: serviceBase, clientId: 'ngAuthApp', uploadArea: serviceBase + 'api/Provider/saveUploadedFile?isFileUpload=false', uploadFilePath: serviceBase + 'api/Provider/saveUploadedFile?isFileUpload=true', isTesting: isTestingEnv });

//Custom Directive for setting focus

app.directive('dgfocus',
function ($timeout) {
    return {
        scope: { trigger: '@dgfocus' },

        link: function (scope, element) {
            scope.$watch('trigger', function (value) {
                if (value === "true") {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }

    };

}

);

app.directive('noSpecialChar', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == null)
                    return ''
                cleanInputValue = inputValue.replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(' ', '');
                if (cleanInputValue != inputValue) {
                    modelCtrl.$setViewValue(cleanInputValue);
                    modelCtrl.$render();
                }
                return cleanInputValue;
            });
        }
    }
});

app.directive('scrollToTop', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {

            element.on('click', function () {
                $('html, body').animate({ scrollTop: 0 }, 'slow');
            });

            //Check to see if the window is top if not then display button
            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $('.floatButton').fadeIn();
                } else {
                    $('.floatButton').fadeOut();
                }
            });

        }
    }
});


app.directive('animateOnChange', function ($animate, $timeout) {
    return function (scope, elem, attr) {
        scope.$watch(attr.animateOnChange, function () {
            if (scope.service !== undefined) {
                var ids = [];
                ids = attr.animateOnChange.replace("[", "").replace("]", "").split(",");

                angular.forEach(ids, function (value, key) {
                    
                    if (scope.service.id == value) {
                        elem[0].className = "form-group col-md-3 digiGroupSelected";
                    }
                });
            }
        });
    };

});


//HTTP interception
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});


app.run(['$rootScope', 'authService', function ($rootScope, authService) {
    authService.fillAuthData();
}]);

app.directive('creditCardType'
  , function () {
      var directive =
        {
            require: 'ngModel'
        , link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (value) {
                scope.ccinfo.type =
                  (/^51/.test(value)) ? "mastercard"
                  : (/^52/.test(value)) ? "mastercard"
                  : (/^53/.test(value)) ? "mastercard"
                  : (/^54/.test(value)) ? "mastercard"
                  : (/^55/.test(value)) ? "mastercard"
                  : (/^4/.test(value)) ? "visa"
                  : (/^34/.test(value)) ? 'amex'
                  : (/^37/.test(value)) ? 'amex'
                  : (/^6011/.test(value)) ? 'discover'
                  : (/^622/.test(value)) ? 'discover'
                  : (/^64/.test(value)) ? 'discover'
                  : (/^65/.test(value)) ? 'discover'
                  : undefined
                ctrl.$setValidity('invalid', !!scope.ccinfo.type)
                return value
            })
        }
        }
      return directive
  });

