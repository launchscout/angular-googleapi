angular.module('demo', ["googleApi"])
    .config(function(googleLoginProvider) {
        googleLoginProvider.configure({
            clientId: '239511214798.apps.googleusercontent.com',
            scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/plus.login"]
        });
    })
    .controller('DemoCtrl', ['$scope', 'googleLogin', 'googleCalendar', 'googlePlus', function ($scope, googleLogin, googleCalendar, googlePlus) {

        $scope.authenticated = false;

        $scope.$on("google:authenticated", function(){
            $scope.authenticated = true;
            $scope.$on('googleCalendar:loaded', function(){
                $scope.calendars = googleCalendar.listCalendars();
                $scope.$apply();
            });
        });

        function checkAuth() {
            setTimeout(function(){
                gapi.auth === undefined ? checkAuth() : googleLogin.checkAuth();
            }, 20);
        }
        checkAuth();


        $scope.login = function () {
            googleLogin.login();
        };

        $scope.$on("googlePlus:loaded", function() {
          googlePlus.getCurrentUser().then(function(user) {
            $scope.currentUser = user;
          });
        })
        $scope.currentUser = googleLogin.currentUser;

        $scope.loadEvents = function() {
            this.calendarItems = googleCalendar.listEvents({calendarId: this.selectedCalendar.id});
        }

        $scope.loadCalendars = function() {
            $scope.calendars = googleCalendar.listCalendars();
        }

    }]);
