angular.module('App.DrilldownCtrl', [])

  .controller('DrilldownCtrl',['$scope', '$filter', 'domainService', function($scope, $filter, domainService) {

    $scope.domain = domainService;

    //$scope.selectedsite = $scope.domain.getSelectedSite();

    //$scope.sort = 'date';

    $scope.filterby ='';
    $scope.range = 'Last Day';

    $scope.getRequestData = domainService.getRequestData;

    $scope.getLastDay = domainService.getLastDay;

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

    //Pagination and sorting
    $scope.sortingOrder = sortingOrder;
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 50;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.items;
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
      //$scope.populate();
      //console.log('Search ' + $scope.items);
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

    //$scope.search();

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
