/**
 * Created by mattjohansen on 6/9/14.
 */
angular.module('App.Filters')

  .filter('attack', function() {
    return function(items, type) {
      if (type === undefined || type == 'All Traffic') {
        return items;
      }
      if (items === undefined) {
        return items;
      }
      else {
        var filtered = [];
        angular.forEach(items, function(item) {
          if (item.attack == 'true') {
            if (type == 'Attacks') {
              filtered.push(item);
            }
            else if (type == 'XSS') {
              angular.forEach(item.attacks, function(attack) {
                if (attack.type == 'XSS') {
                  filtered.push(item);
                }
              });
            }
            else if (type == 'SQLi') {
              angular.forEach(item.attacks, function(attack) {
                if (attack.type == 'SQLi') {
                  filtered.push(item);
                }
              });
            }
            else if (type == 'Directory Traversal') {
              angular.forEach(item.attacks, function(attack) {
                if (attack.type == 'dirTrav') {
                  filtered.push(item);
                }
              });
            }
            else if (type == 'Remote Code Execution') {
              angular.forEach(item.attacks, function(attack) {
                if (attack.type == 'RCE') {
                  filtered.push(item);
                }
              });
            }
          }
        });
        return filtered;
      }
    };
  });