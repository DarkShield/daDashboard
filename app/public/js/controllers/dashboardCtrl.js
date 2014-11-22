angular.module('App.Controllers')
  .controller('dashboardCtrl',['$scope', 'trafficService', function($scope, trafficService){
    $scope.enddate = new Date();

    $scope.startdate = (function(){
      var d = new Date();
      d.setHours(-24);
      return d;
    })();

    $scope.requestrange = {
      start: $scope.startdate.toISOString(),
      end: $scope.enddate.toISOString()
    };

    $scope.getRequestData = function(){
      trafficService.getRange($scope.requestrange);
    };

    $scope.getVisitors = trafficService.getIPs

    $scope.getRequestData();

  }]);