angular.module('App.Controllers')
  .controller('dashboardCtrl',['$scope', '$filter', 'trafficService', function($scope, $filter, trafficService){
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

    $scope.getRequestData();

    $scope.getVisitors = function(){
      var requestsByIP = trafficService.getIPs();
      requestsByIP = $filter('toArray')(requestsByIP);
      return (requestsByIP && requestsByIP.length) ? requestsByIP.length : 'Loading...'
    };

    $scope.getAttackers = function(){
      $scope.attacks = trafficService.getAttacks();
      var attackers = $filter('groupBy')($scope.attacks, 'remoteIP');
      attackers = $filter('toArray')(attackers);

      return (attackers && attackers.length) ? attackers.length : 'Loading'
    };

    $scope.getRequestCount = function(){
      return (trafficService.requests && trafficService.requests.length) ?  trafficService.requests.length : 'Loading...'
    }

    $scope.getAttackCount = function(){
      var attacks = $filter('toArray')(trafficService.getAttacks());
      return (attacks && attacks.length) ? attacks.length : 'Loading'
    };

  }]);