angular.module('demo', ["googleApi"])
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
