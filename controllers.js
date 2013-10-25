angular.module('demo', ["googleApi"])
    .config(function(googleLoginProvider) {
        googleLoginProvider.configure({
            clientId: '239511214798.apps.googleusercontent.com',
            scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/calendar"]
        });
    })
    .controller('DemoCtrl', ['$scope', 'googleLogin', 'googleCalendar', function ($scope, googleLogin, googleCalendar) {

        $scope.login = function () {
            googleLogin.login();
        };

        $scope.loadEvents = function() {
            this.calendarItems = googleCalendar.listEvents({calendarId: this.selectedCalendar.id});
        }

        $scope.loadCalendars = function() {
            $scope.calendars = googleCalendar.listCalendars();
        }

    }]);
