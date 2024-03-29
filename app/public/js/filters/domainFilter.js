/**
 * Created by mattjohansen on 6/9/14.
 */
angular.module('App.Filters')

  .filter('domain', function() {
    return function(items, domain) {
      if (domain.length == 0) {
        return items;
      }
      if (items === undefined) {
        return items;
      }
      else {
        var filtered = [];
        angular.forEach(items, function(item) {
          if (item.headers.host == domain) {
            filtered.push(item);
          }
        });
        return filtered;
      }
    };
  });