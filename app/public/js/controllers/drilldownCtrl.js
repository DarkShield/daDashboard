angular.module('App.DrilldownCtrl', [])

  .controller('DrilldownCtrl',['$scope', 'domainService', function($scope, domainService) {

     $scope.domain = domainService;

     //$scope.selectedsite = $scope.domain.getSelectedSite();

     $scope.sort = 'date';

     $scope.filterby ='';

     /*$scope.dropdown = [
       {
         "text": "All",
         "click": "$scope.filterby = '';"
       },
       {
         "text": "XSS",
         "click": "$scope.filterby = 'XSS';"
       },
       {
         "text": "SQLi",
         "click": "$scope.filterby = 'SQLi';"
       },
       {
         "text": "Directory Traversal",
         "click": "filterby = 'Directory Traversal'"
       }
     ];*/

    $scope.details = function(){
      var selectedsite = $scope.domain.getSelectedSite();
      return selectedsite.requestData;
    };

    $scope.attacks = function(){
      var selectedsite = $scope.domain.getSelectedSite();
      if (!selectedsite.attacks){
         return 0;
      }
      else {
         return selectedsite.attacks.length;
      }
    };

    $scope.displayFilter = function(){
      //TODO: figure out if blocks for potential filters here
      //
    };
  }]);
