angular.module('App.Controllers')

  .controller('trafficCtrl',['$scope', '$filter', 'domainService', 'domainFilter', 'paginationService', 'trafficService', function($scope, $filter, domainService, domainFilter, paginationService, trafficService) {

    $scope.selectedsite = [];
    $scope.attackview = [];
    $scope.filterby ='';
    $scope.selectedItem = [];

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
    //ng-init
    $scope.getDomains = domainService.fetchDomains;

    //ng-repeat
    $scope.domains = domainService.getDomains;

    //Pagination and sorting
    $scope = paginationService.init($scope);

    $scope.applyFilter = function(){
      var domainfiltered = $filter('domain')($scope.items, $scope.selectedsite);
      var attackfilter = $filter('filter')(domainfiltered, $scope.attackview);
      var searchfilter = $filter('filter')(attackfilter, $scope.query);
      var ordered = $filter('orderBy')(searchfilter, 'requestedtimestamp', true);
      $scope.pagedItems = paginationService.paginate(ordered, $scope);
    };

    $scope.watchHandler = function(newValue, oldValue) {
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      if(newValue !== oldValue){
        $scope.applyFilter();
      }
    };

    $scope.$watch('currentPage', $scope.watchHandler );
    $scope.$watch('query', $scope.watchHandler);

    //Below called from view
    $scope.getRequestData = function(){
      if(trafficService.requests.length === 0) {
        trafficService.getRange($scope.requestrange);
      }
    };

    $scope.getRequestData();

    $scope.showDetails = function(show, id, key){
      if(show) {
        trafficService.getDetails(id).then(function(request){
          $scope.pagedItems[key] = request;
        });
      }
    };

    $scope.toggleAttack = function(item){
      trafficService.toggleAttack(item._id, item.attack);
      item.attack = (item.attack === 'false') ? 'true' : 'false'
    };

    $scope.toggleBlock = function(item) {
      if (item.blocked === undefined){
        item.blocked = false;
      }
      if (item.blocked === false){
        trafficService.toggleBlock(item.remoteIP, item.headers.host);
        item.blocked = true;
      }
    };

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
      return ($scope.selectedsite.length === 0) ? 'All Sites' : $scope.selectedsite
    };

    $scope.attackDisplay = function(){
      return ($scope.attackview.length === 0) ? 'All Traffic' : 'Attacks'
    };

    $scope.getPagedItems = function(){
      if($scope.items !== trafficService.requests){
        $scope.items = trafficService.requests;
        $scope.applyFilter();
      }
      return $scope.pagedItems
    };

    $scope.selectAll = function(type){
      $scope.itemsPerPage = $scope.defaultItemsPerPage;
      $scope[type] = [];
      $scope.applyFilter();
    };

    $scope.pickDomain = function(domain){
      $scope.selectedsite = domain;
      $scope.applyFilter();
    };

    $scope.showAttacks = function(){
      $scope.attackview = {attack: 'true'};
      $scope.applyFilter();
    };
}]);