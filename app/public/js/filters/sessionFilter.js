/**
 * Created by mattjohansen on 6/9/14.
 */
angular.module('App.Filters')

  .filter('session', function() {
    return function(items, session) {
      if (session === undefined) {
        return items;
      }
      if (items === undefined) {
        return items;
      }
      else {
        var filtered = [];
        angular.forEach(items, function(item) {
          if (item.dstc == session) {
            filtered.push(item);
          }
        });
        return filtered;
      }
    };
  });