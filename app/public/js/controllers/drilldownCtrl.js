angular.module('App.drilldownCtrl', [])

  .controller('drilldownCtrl',['$scope', '$filter', 'domainService', function($scope, $filter, domainService) {

    $scope.domains = domainService.doms;

    $scope.drillsite = domainService.getSelectedSite();

    $scope.site = {};

    $scope.filterby ='';

    $scope.range = 'Last Day';

    $scope.details = function(){
      return $scope.drillSite.requestData;
    };

    $scope.attacks = function(){
      if (!$scope.drillSite.attacks){
         return 0;
      }
      else {
         return drillsite.attacks.length;
      }
    };

    //Pagination and sorting
    //TODO should pagination be factored into a service?
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 50;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.populate = function() { $scope.items = $scope.details(); };
    //$scope.items = $scope.populate();
    //$scope.populate();

    $scope.$on('Request.data', function(event, body) {
      $scope.populate();
      $scope.search();
    });

    var searchMatch = function (pile, q) {
      if(!q) {
        return true;
      }
      return pile.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    };

    $scope.search = function() {
     //TODO should be converted to angular for each
      $scope.filteredItems = $filter('filter')($scope.items, function (item) {
        for(var attr in item) {
          if (searchMatch(JSON.stringify(item[attr]), $scope.query))
            return true;
          }
          return false;
      });

      if ($scope.sortingOrder !== '') {
        $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
      }
      $scope.currentPage = 0;

      $scope.groupToPages();
    };

    $scope.groupToPages = function () {
      $scope.pagedItems = [];

      for (var i = 0; i < $scope.filteredItems.length; i++) {
        if (i % $scope.itemsPerPage === 0) {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
        } else {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
        }
      }
    };

    $scope.range = function (start, end) {
      var ret = [];
      if (!end) {
        end = start;
        start = 0;
      }
      for (var i = start; i < end; i++) {
        ret.push(i);
      }
      return ret;
    };

    $scope.prevPage = function () {
      if ($scope.currentPage > 0) {
        $scope.currentPage--;
      }
    };

    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.pagedItems.length - 1) {
        $scope.currentPage++;
      }
    };

    $scope.setPage = function () {
      $scope.currentPage = this.n;
    };

    //TODO I don't like this at all. Manual DOM manipulation = BAD
    $scope.sort_by = function(newSortingOrder) {
      if ($scope.sortingOrder == newSortingOrder)
        $scope.reverse = !$scope.reverse;

      $scope.sortingOrder = newSortingOrder;

      $('th i').each(function(){
        $(this).removeClass().addClass('icon-sort');
      });
      if ($scope.reverse)
        $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-up');
      else
        $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-down');
    };
}]);
