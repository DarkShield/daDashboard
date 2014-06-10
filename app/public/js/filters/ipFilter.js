/**
 * Created by mattjohansen on 6/9/14.
 */
angular.module('App.Filters')

  .filter('ip', function() {
    return function(items, ip) {
      if (ip === undefined) {
        return items;
      }
      if (items === undefined) {
        return items;
      }
      else {
        var filtered = [];
        angular.forEach(items, function(item) {
          if (item.remoteIP == ip) {
            filtered.push(item);
          }
        });
        return filtered;
      }
    };
  });