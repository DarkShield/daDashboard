angular.module('App.Controllers')

  .controller('attackerCtrl',['$scope', '$filter', 'domainService', 'paginationService', 'trafficService', 'ipFilter', 'attackFilter', function($scope, $filter, domainService, paginationService, trafficService, ipFilter, attackFilter) {

    $scope.drillsite = [];
    $scope.attackview = [];
    $scope.filterby ='';

    $scope = paginationService.init($scope);
    $scope.getDomains = domainService.fetchDomains;
    $scope.domains = domainService.getDomains;

    $scope.startdate = (function(){
      var d = new Date();
      d.setHours(-24);
      return d;
    })();

    $scope.enddate = new Date();

    $scope.requestrange = {
      start: $scope.startdate.toISOString(),
      end: $scope.enddate.toISOString()
    };

    //ng-init
    $scope.getRequestData = function(){
      if(trafficService.requests.length === 0){
       trafficService.getRange($scope.requestrange);
      }
    };

    $scope.applyFilter = function(){
      var attackdata = $filter('attack')($scope.items, 'Attacks');
      var groupIP = $filter('groupBy')(attackdata, 'remoteIP');
      groupIP = paginationService.groupedObjectToArray(groupIP);
      var searchdata = $filter('filter')(groupIP, $scope.query);
      $scope.pagedItems = paginationService.paginate(searchdata, $scope);
    };

    //Table ng-repeat
    $scope.getPagedItems = function(){
      if($scope.items !== trafficService.requests){
        $scope.items = trafficService.requests;
        $scope.applyFilter();
      }
      return $scope.pagedItems
    };

    //Attack Button
    $scope.toggleAttack = function(item){
      trafficService.toggleAttack(item._id, item.attack);
      item.attack = (item.attack === 'false') ? 'true' : 'false'
    };

    //Block Button
    $scope.toggleBlock = function(item) {
      if (item.blocked === undefined){
        item.blocked = false;
      }
      if (item.blocked === false){
        trafficService.toggleBlock(item.remoteIP, item.headers.host);
        item.blocked = true;
      }
    };

    //Dropdown
    $scope.selectAll = function(type){
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      $scope[type] = [];
      $scope.applyFilter();
    };

    //Dropdown
    $scope.pickDomain = function(domain){
      $scope.drillsite = domain;
      $scope.applyFilter();
    };

    //Listener for pagination Changes
    $scope.$watch('currentPage', function(newValue, oldValue) {
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
        $scope.applyFilter();
      }
    });

    //Listener for search changes
    $scope.$watch('query', function(newValue, oldValue){
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
        $scope.applyFilter();
      }
    });

    //Text and CSS formatting
    $scope.showButtonDisplay = function(rowstate){
      return (rowstate) ? 'Hide' : 'Show'
    };
    $scope.markButtonDisplay = function(item){
      return (item && item.attack === 'true') ? 'Un-Mark as Attack' : 'Mark as Attack'
    };
    $scope.blockButtonDisplay = function(item){
      //return (item.blocked === true) ? 'Unblock' : 'Block'
      return 'Block'
    };
    $scope.siteDisplay = function(){
      return ($scope.drillsite.length === 0) ? 'All Sites' : $scope.drillsite
    };
    $scope.attackDisplay = function(){
      return ($scope.attackview.length === 0) ? 'All Traffic' : 'Attacks'
    };
}]);