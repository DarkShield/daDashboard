angular.module('App.Services')

  .factory('paginationService', ['$http', '$rootScope', function($http, $rootScope){

  var pages = {
    maxSize : 10,
    itemsPerPage : 10,

    init: function(controllerScope){
      controllerScope.items = [];
      controllerScope.pagedItems = [];
      controllerScope.totalItems = 0;
      controllerScope.currentPage = 1;
      controllerScope.maxSize = pages.maxSize;
      controllerScope.defaultItemsPerPage = pages.itemsPerPage;

      return controllerScope
    },

    paginate: function(dataset, controllerScope){
      var currentPageItems = [];
      controllerScope.totalItems = dataset.length;
      controllerScope.lastPage = Math.ceil(controllerScope.totalItems / pages.itemsPerPage);
      var startItem = (controllerScope.currentPage * pages.itemsPerPage) - pages.itemsPerPage;
      var endItem = controllerScope.currentPage * pages.itemsPerPage - 1;
      if(controllerScope.currentPage === controllerScope.lastPage && controllerScope.totalItems % pages.itemsPerPage !== 0){
        var lastPageLength = controllerScope.totalItems % pages.itemsPerPage;
        endItem = startItem + lastPageLength -1;
      }

      //create pagedItem set
      for(var i=startItem;i<=endItem;i++){
        currentPageItems.push(dataset[i]);
      }
      return currentPageItems;
    }

  };

  return pages;

}]);