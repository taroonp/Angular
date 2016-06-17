'use strict';
app.controller('navController', ['$scope', '$rootScope', '$location', 'authService', 'Idle', '$modal', 'Title', '$timeout', function ($scope, $rootScope, $location, authService, Idle, $modal, Title, $timeout) {


    //Adding method prototype
    String.prototype.endsWith = function (str)
    { return (this.match(str + "$") == str) }

    String.prototype.startsWith = function (str)
    { return (this.match("^" + str) == str) }

    $scope.logOut = function () {

        $location.path('/home');

        $timeout(function () {

            authService.logOut();
        }, 200);
    }

    $scope.isActive = function (route) {

        if (route == '/home') {
            if ($location.path().startsWith(route) || $location.path() == '/')
                return true;
            else
                return false;
        }
        else
            return $location.path().startsWith(route);
    };

    $scope.userDetail = authService.userDetail;

    function closeModals() {
        if ($scope.warning) {
            $("#waitingSession").modal('hide');
            $scope.warning = null;
        }
    }

    $rootScope.$on('IdleStart', function () {
        closeModals();
        $scope.warning = $("#waitingSession").modal('show');
    });

    $rootScope.$on('IdleEnd', function () {
        closeModals();
    });

    $rootScope.$on('IdleTimeout', function () {
        closeModals();
        $scope.logOut();

        Title.restore();
        $("#endSession").modal('show');

    });

}]);