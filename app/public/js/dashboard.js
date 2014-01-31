var App = window.App = angular.module('App',
  [
    'ui.bootstrap',
    'App.Controllers',
    'App.Services'
  ],
  function ($routeProvider, $locationProvider) {
    $routeProvider.when('/traffic', {
      templateUrl: '../html/traffic.html',
      controller: 'trafficCtrl'
    });
    $routeProvider.when('/', {
      templateUrl: '../html/home.html',
      controller: 'homeCtrl'
    });
  }
);

angular.module('App.Controllers', []);
angular.module('App.Services', []);