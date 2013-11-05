//var dashboard = {};
var App = window.App = angular.module('App',
  [
    'ui.bootstrap',
    'App.trafficCtrl',
    'App.SidebarCtrl',
    'App.domainService'
  ],
  function ($routeProvider, $locationProvider) {
    $routeProvider.when('/traffic', {
      templateUrl: '../html/traffic.html',
      controller: 'trafficCtrl'
    });
    $routeProvider.when('/', {
      templateUrl: '../html/home.html'
    });
  }
);
