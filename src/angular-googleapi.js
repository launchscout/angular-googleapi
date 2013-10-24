angular.module('googleApi', [])
	.value('version', '0.1')

    .service('googleLogin', ['$http', '$rootScope', '$q', 'googleCalendar', function ($http, $rootScope, $q, googleCalendar) {
        var clientId = '239511214798.apps.googleusercontent.com',
            scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/calendar"],
            deferred = $q.defer();

        this.login = function () {
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false}, this.handleAuthResult);

            return deferred.promise;
        }

        this.handleClientLoad = function () {
            gapi.auth.init(function () { });
            window.setTimeout(checkAuth, 1);
        };

        this.checkAuth = function() {
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, this.handleAuthResult );
        };

        this.handleAuthResult = function(authResult) {
            if (authResult && !authResult.error) {
                var data = {};
                gapi.client.load('oauth2', 'v2', function () {
                    var request = gapi.client.oauth2.userinfo.get();
                    request.execute(function (resp) {
                        $rootScope.$apply(function () {
                            data.email = resp.email;
                        });
                    });
                });
                googleCalendar.loadClient();
                deferred.resolve(data);
            } else {
                deferred.reject('error');
            }
        };

        this.handleAuthClick = function (event) {
            gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false, hd: domain }, this.handleAuthResult );
            return false;
        };

    }])

    .service("googleCalendar", function($q, $rootScope) {

        function gapiBuilder(requestBuilder) {
            return function(args) {
                var deferred = $q.defer();
                request = requestBuilder(args);
                request.execute(function(resp, raw) {
                    if(resp.error) {
                        console.log(resp.error);
                        deferred.reject(resp.error);
                    } else {
                        deferred.resolve(resp.items);
                    }

                });
                return deferred.promise;

            }
        }

        this.loadClient = function() {
            var self = this;
            gapi.client.load('calendar', 'v3', function() {
                self.listEvents = gapiBuilder(gapi.client.calendar.events.list);
                self.listCalendars = gapiBuilder(gapi.client.calendar.calendarList.list);
            });

        }

    });