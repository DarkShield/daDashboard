angular.module('App.SidebarCtrl', [])

  .controller('SidebarCtrl',['$scope', 'domainService', function($scope){
    $scope.panelstates = {
      dashboard: 'active panel',
      attackers: 'panel',
      sites: 'panel',
      statistics: 'panel',
      config: 'panel'
    };

    $scope.setActivePanel = function(panel){
      angular.forEach($scope.panelstates, function(value,key){
        if(panel === key){
          $scope.panelstates[key] = 'active panel';
        }else{
          $scope.panelstates[key]= 'panel';
        }
      })
    }
  }]);
