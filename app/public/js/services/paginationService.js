angular.module('App.Services')

  .factory('paginationService', ['$http', function($http){

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

    //allows paginate to accept array or object
    groupedObjectToArray: function(dataset){
      var dataArray = [];
      for(var prop in dataset){
        if(dataset.hasOwnProperty(prop)){
          var obj = {}
          obj[prop] = dataset[prop];
          dataArray.push(obj);
        }
      }
      return dataArray
    },


    paginate: function(data, controllerScope){
      var currentPageItems = [];
      var dataset = (data && data.length) ? data : pages.groupedObjectToArray(data)
      controllerScope.totalItems = dataset.length;
      controllerScope.lastPage = Math.ceil(controllerScope.totalItems / pages.itemsPerPage);
      var startItem = (controllerScope.currentPage * pages.itemsPerPage) - pages.itemsPerPage;
      var endItem = (controllerScope.totalItems <= 10) ? controllerScope.totalItems : (controllerScope.currentPage * pages.itemsPerPage) - 1;
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