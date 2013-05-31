function drilldownCtrl($scope, domainService){

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

   // Probably don't need
   /*$scope.displayFilter = function(){
      if ($scope.filterby === ''){
         return 'All';
      }
      else if ($scope.filterby === 'XSS'){
         return 'XSS';
      }
      else if ($scope.filterby === 'SQLi'){
         return 'SQLi';
      }
      else if ($scope.filterby === 'Directory Traversal'){
         return 'Directory Traversal';
      }
      else {
         return $scope.filterby;
      }
   }*/

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
}
