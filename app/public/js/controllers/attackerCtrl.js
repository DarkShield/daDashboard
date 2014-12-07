angular.module('App.Controllers')

  .controller('attackerCtrl',['$scope', '$filter', 'domainService', 'domainFilter', 'paginationService', 'trafficService', 'ipFilter', 'attackFilter', function($scope, $filter, domainService, domainFilter, paginationService, trafficService, ipFilter, attackFilter) {

    $scope.selectedsite = [];
    $scope.filterby ='';


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

    $scope.getRequestData();

    //Pagination and Sorting
    $scope = paginationService.init($scope);

    $scope.applyFilter = function(){
      var activeDomains = $filter('filterBy')(trafficService.getAttacks(true), ['headers.host'], $scope.selectedsite);
      var groupIP = $filter('groupBy')(activeDomains, 'remoteIP');
      var searchData = $filter('filter')(groupIP, $scope.query);

      $scope.pagedItems = paginationService.paginate(searchData, $scope);
    };


    /*Below called in view
    ng-inti*/
    $scope.getRequestData = function(){
      if(trafficService.requests.length === 0){
        trafficService.getRange($scope.requestrange);
      }
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
      $scope.selectedsite = domain;
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

    $scope.getSessionCount = function(filteredData){
      var uniqueDSTC = $filter('unique')(filteredData,'dstc');
      return uniqueDSTC.length
    };

    $scope.getAttackersImproved = function(filteredData){
      var DSTC = $filter('groupBy')(filteredData,'dstc');
      var IP = $filter('groupBy')(filteredData,'remoteIP');

    };

    $scope.displayAttackTypes = function(filteredData){
      var types = $filter('groupBy')(filteredData,'attacks[0].type');
      delete types.undefined
      return types
    };

    //Text and CSS formatting
    $scope.showButtonDisplay = function(rowstate){
      return (rowstate) ? 'Hide' : 'More info...'
    };
    $scope.markButtonDisplay = function(item){
      return (item && item.attack === 'true') ? 'Un-Mark as Attack' : 'Mark as Attack'
    };
    $scope.blockButtonDisplay = function(item){
      //return (item.blocked === true) ? 'Unblock' : 'Block'
      return 'Block'
    };
    $scope.siteDisplay = function(){
      return ($scope.selectedsite.length === 0) ? 'All Sites' : $scope.selectedsite
    };
    $scope.attackDisplay = function(){
      return ($scope.attackview.length === 0) ? 'All Traffic' : 'Attacks'
    };
}]);