angular.module('App.Controllers')
  .controller('dashboardCtrl',['$scope', '$filter', 'trafficService', function($scope, $filter, trafficService){


    $scope.startdate = (function(){
      var d = new Date();
      var hour = d.getHours() - 4;
      d.setHours(hour);
      return d;
    })();

    $scope.enddate = new Date();

    $scope.requestrange = {
      start: $scope.startdate.toISOString(),
      end: $scope.enddate.toISOString()
    };

    $scope.getVisitors = function(){
      var requestsByIP = trafficService.getIPs();
      requestsByIP = $filter('toArray')(requestsByIP);
      return (requestsByIP && requestsByIP.length) ? requestsByIP.length : 'Loading...'
    };

    $scope.getAttackerCount = function(){
      $scope.attacks = trafficService.getAttacks(true);
      var attackers = $filter('groupBy')($scope.attacks, 'remoteIP');
      attackers = $filter('toArray')(attackers);

      return (attackers && attackers.length) ? attackers.length : 'Loading'
    };

    $scope.getAttackers = function(){
      $scope.attacks = trafficService.getAttacks(true);
      var attackers = $filter('groupBy')($scope.attacks, 'remoteIP');
      attackers = $filter('toArray')(attackers);
      return (attackers) ? attackers : []
    };

    $scope.getLastSeen = function(attacks){
      var sorted = $filter('orderBy')(attacks, 'requestedtimestamp');
      var reversed = $filter('reverse')(sorted);
      var date = new Date(reversed[0].requestedtimestamp);
      return (date) ? date : 'Loading'
    };

    $scope.getRequestCount = function(){
      return (trafficService.requests && trafficService.requests.length) ?  trafficService.requests.length : 'Loading...'
    };

    $scope.getAttackCount = function(){
      var attacks = $filter('toArray')(trafficService.getAttacks(true));
      return (attacks && attacks.length) ? attacks.length : 'Loading'
    };
    $scope.config = {
      visible: true, // default: true
      extended: false, // default: false
      disabled: false, // default: false
      autorefresh: true, // default: true
      refreshDataOnly: false // default: false
    };

    $scope.options = {
      chart: {
        type: 'stackedAreaChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 40
        },
        x: function(d){return d[0];},
        y: function(d){return d[1];},
        useVoronoi: false,
        clipEdge: true,
        transitionDuration: 500,
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickFormat: function(d) {
            return $filter('date')(d, 'shortTime');
          }
        },
        yAxis: {
          showMaxMin:false,
          tickFormat: function(d){
            return d;
          }
        }
      }
    };

    $scope.data = trafficService.getChartData;

    if(trafficService.requests.length === 0){
      trafficService.getRange($scope.requestrange).then(function(){
          $scope.data = trafficService.getChartData();
    })}
  }]);