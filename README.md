angular-googleapi
=================

angular-googleapi makes it easy to use google apis from angular. So far we have support for login and a couple of google calendar methods, but it should be super easy to add others.

Installation
------------

````
bower install angular-googleapi
````

Or just download src/angular-googleapi.js

Then in your angular module add angular-googleapi as a dependency.

Usage
-----

The module will automatically load and initialize the Google API.
There is no need to manually include a `<script>` element to load the API.
Once the API is ready, it will broadcast a `google:ready` message to $rootScope.

Once this has occurred, call `googleLogin.login()` to perform the login operation.
This method returns a promise.

Demo
----

Clone this repo. Install node and http-server npm. Run http-server -p 8000
and go to http://localhost:8000/example.html to see an app that will let you load
entries from your google calendar.

Also, check out [LetsGitLunch](http://github.com/gaslight/letsgitlunch)
