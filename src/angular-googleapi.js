angular.module('googleApi', [])
	.value('version', '0.1')

    .service("googleApiBuilder", function($q) {
        this.loadClientCallbacks = [];

        this.build = function(requestBuilder) {
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
        };

        this.afterClientLoaded = function(callback) {
            this.loadClientCallbacks.push(callback);
        };

        this.runClientLoadedCallbacks = function() {
            for(var i=0; i < this.loadClientCallbacks.length; i++) {
                this.loadClientCallbacks[i]();
            }
        };
    })

    .provider('googleLogin', function() {

        this.configure = function(conf) {
            this.config = conf;
        };

        this.$get = function ($q, googleApiBuilder) {
            var config = this.config;
            var deferred = $q.defer();
            return {
                login: function () {
                    gapi.auth.authorize({ client_id: config.clientId, scope: config.scopes, immediate: false}, this.handleAuthResult);

                    return deferred.promise;
                },

                handleClientLoad: function () {
                    gapi.auth.init(function () { });
                    window.setTimeout(checkAuth, 1);
                },

                checkAuth: function() {
                    gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, this.handleAuthResult );
                },

                handleAuthResult: function(authResult) {
                    if (authResult && !authResult.error) {
                        var data = {};
                        googleApiBuilder.runClientLoadedCallbacks();
                        deferred.resolve(data);
                    } else {
                        deferred.reject(authResult.error);
                    }
                },
            }
        };


    })

    .service("googleCalendar", function(googleApiBuilder) {

        var self = this;

        googleApiBuilder.afterClientLoaded(function() {
            gapi.client.load('calendar', 'v3', function() {
                self.listEvents = googleApiBuilder.build(gapi.client.calendar.events.list);
                self.listCalendars = googleApiBuilder.build(gapi.client.calendar.calendarList.list);
            });

        });

    });