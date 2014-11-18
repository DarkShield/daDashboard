var App = window.App = angular.module('App',
  [
    'ngRoute',
    'ui.bootstrap',
    'angular.filter',
    'App.Controllers',
    'App.Services',
    'App.Filters'
  ],
  function ($routeProvider, $locationProvider) {
    $routeProvider.when('/traffic', {
      templateUrl: '/html/traffic.html',
      controller: 'trafficCtrl'
    });

    $routeProvider.when('/attackers', {
      templateUrl: '/html/attackers.html',
      controller: 'attackerCtrl'
    });
    $routeProvider.when('/', {
      templateUrl: '/html/home.html'
    });
  }
);

angular.module('App.Controllers', []);
angular.module('App.Services', []);
angular.module('App.Filters', []);