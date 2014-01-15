/**
 * Created by mattjohansen on 1/14/14.
 */
angular.module('App.Controllers')

  .controller('homeCtrl',['$scope', 'domainService', function($scope, domainService) {

    $scope.enddate = new Date();
    $scope.startdate = (function(){
      var d = new Date();
      d.setDate(d.getDate() - 30);
      return d;
    })();
    $scope.requestrange = {
      start: $scope.startdate.toISOString(),
      end: $scope.enddate.toISOString()
    };

    $scope.countUsers = function() {
      domainService.countUsers($scope.requestrange);
    };

    $scope.countedByDate = [];
    $scope.monthly = [];
    $scope.$on('Users.count', function(event, body){
      $scope.countedByDate = body;
      $scope.monthly = $scope.countedByDate[$scope.countedByDate.length - 1];
      $scope.attackerPerc = Math.round(($scope.monthly.totalMonthlyAttackers/$scope.monthly.totalMonthlyUsers)*100);
      $scope.attackPerc = Math.round(($scope.monthly.monthlyAttacks/$scope.monthly.monthlyRequests)*100);
    });

  }]);