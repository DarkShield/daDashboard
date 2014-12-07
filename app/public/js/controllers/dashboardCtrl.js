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
      if(trafficService.requests.length === 0) {
        trafficService.getRange($scope.requestrange);
      }
    };

    $scope.getVisitors = function(){
      var requestsByIP = trafficService.getIPs();
      requestsByIP = $filter('toArray')(requestsByIP);
      return (requestsByIP && requestsByIP.length) ? requestsByIP.length : 'Loading...'
    };

    $scope.getAttackerCount = function(){
      $scope.attacks = trafficService.getAttacks();
      var attackers = $filter('groupBy')($scope.attacks, 'remoteIP');
      attackers = $filter('toArray')(attackers);

      return (attackers && attackers.length) ? attackers.length : 'Loading'
    };

    $scope.getAttackers = function(){
      $scope.attacks = trafficService.getAttacks();
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
      var attacks = $filter('toArray')(trafficService.getAttacks());
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
          tickFormat: function(d){
            return d;
          }
        }
      }
    };


    $scope.data = function(){
      trafficService.getRange($scope.requestrange).then(function(){
        var data = [
          {
            key: 'Traffic',
            values: []
          },
          {
            key: 'Attacks',
            values: []
          }
        ];
        var requests = trafficService.requests;

        angular.forEach(requests, function(value,key){
          requests[key].requestedtimestamp = $filter('date')(value.requestedtimestamp, 'short');
        });

        var requestsByTime = $filter('groupBy')(requests, 'requestedtimestamp');

        angular.forEach(requestsByTime, function(value, key){
          var d = new Date(key);
          data[0].values.push([d, value.length]);
        });


        var attacks = trafficService.getAttacks();

        angular.forEach(attacks, function(value, key){
          attacks[key].requestedtimestamp = $filter('date')(value.requestedtimestamp, 'short');
        });

        var attacksByTime = $filter('groupBy')(attacks, 'requestedtimestamp');

        angular.forEach(attacksByTime, function(value, key){
          var d = new Date(key);
          data['1'].values.push([d, value.length]);
        });
        $scope.data = data;
      });
      //must return an array until the xhr returns to prevent d3 error
      return []
    }
  }]);