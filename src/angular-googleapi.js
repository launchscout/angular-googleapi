angular.module('googleApi', [])
	.value('version', '0.1')

    .service("googleApiBuilder", function($q) {
        this.loadClientCallbacks = [];

        this.build = function(requestBuilder, responseTransformer) {
            return function(args) {
                var deferred = $q.defer();
                var response;
                request = requestBuilder(args);
                request.execute(function(resp, raw) {
                    if(resp.error) {
                        deferred.reject(resp.error);
                    } else {
                        response = responseTransformer ? responseTransformer(resp) : resp;
                        deferred.resolve(response);
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

        this.$get = function ($q, googleApiBuilder, $rootScope) {
            var config = this.config;
            var deferred = $q.defer();
            var svc = {
                login: function () {
                    gapi.auth.authorize({ client_id: config.clientId, scope: config.scopes, immediate: false}, this.handleAuthResult);

                    return deferred.promise;
                },

                handleAuthResult: function(authResult) {
                    if (authResult && !authResult.error) {
                        var data = {};
                        $rootScope.$broadcast("google:authenticated", authResult);
                        googleApiBuilder.runClientLoadedCallbacks();
                        deferred.resolve(data);
                    } else {
                        deferred.reject(authResult.error);
                    }
                },
            };

            // load the gapi client, instructing it to invoke a globally-accessible function when finished
            window._googleApiLoaded = function() {
                gapi.auth.init(function () {
                    $rootScope.$broadcast("google:ready", {});
                });
            };
            var script = document.createElement('script');
            script.setAttribute("type","text/javascript");
            script.setAttribute("src", "https://apis.google.com/js/client.js?onload=_googleApiLoaded");
            document.getElementsByTagName("head")[0].appendChild(script);

            return svc;
        };
    })

    .service("googleCalendar", function(googleApiBuilder, $rootScope) {

        var self = this;
        var itemExtractor = function(resp) { return resp.items; };

        googleApiBuilder.afterClientLoaded(function() {
            gapi.client.load('calendar', 'v3', function() {

                self.listEvents = googleApiBuilder.build(gapi.client.calendar.events.list, itemExtractor);
                self.listCalendars = googleApiBuilder.build(gapi.client.calendar.calendarList.list, itemExtractor);
                self.createEvent = googleApiBuilder.build(gapi.client.calendar.events.insert);

                $rootScope.$broadcast("googleCalendar:loaded")
            });

        });

    })

		.service("googlePlus", function(googleApiBuilder, $rootScope) {

				var self = this;
				var itemExtractor = function(resp) { return resp.items; };

				googleApiBuilder.afterClientLoaded(function() {
						gapi.client.load('plus', 'v1', function() {
							self.getPeople = googleApiBuilder.build(gapi.client.plus.people.get);
							self.getCurrentUser = function() {
								return self.getPeople({userId: "me"});
							}
							$rootScope.$broadcast("googlePlus:loaded")
						});

				});

		})
