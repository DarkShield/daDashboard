angular.module('App.Services')

  .factory('trafficService', ['$http', '$filter', function($http, $filter){
    'use strict';

    var traffic = {
      requests:[],

      toggleAttack: function(id, attack) {
        $http.post('/toggle/attack', {id: id, attack: attack});
      },

      toggleBlock: function(ip, host) {
        $http.post('/toggle/block', {ip: ip, host: host});
      },

      getRange: function(range, callback){
        return $http.post('/traffic', range).then(function(response){
          traffic.requests = response.data;
          return response.data
        });
      },

      getSessions: function(){
        return $filter('groupBy')(traffic.requests, 'dstc')
      },

      getIPs: function(){
        return $filter('groupBy')(traffic.requests, 'remoteIP')
      },

      getAttacks: function(){
        return $filter('attack')(traffic.requests, 'Attacks');
      },

      getDetails: function(id){
        return $http.post('/traffic/request-details', {id: id}).then(function(response){
          return response.data;
        });
      },

      getChartData: function(){
        if(traffic.requests.length > 0){
          var reqs = {
            key: 'Requests',
            values: []
          };
          var att = {
            key: 'Attacks',
            values: []
          };
          var requests = traffic.requests;
          //Shorten timestamp to minutes
          angular.forEach(requests, function(request){
            request.requestedtimestamp = $filter('date')(request.requestedtimestamp, 'short');
          });
          var requestsByTime = $filter('groupBy')(requests, 'requestedtimestamp');
          var attacksByTime = $filter('groupBy')($filter('attack')(requests, 'Attacks'), 'requestedtimestamp');
          //Attack time-series
          angular.forEach(attacksByTime, function(attacks, timestamp){
            var d = new Date(timestamp);
            att.values.push([d, attacks.length]);
          });
          //Request time-series
          angular.forEach(requestsByTime, function(requests,timestamp){
            var d = new Date(timestamp);
            reqs.values.push([d, requests.length]);
            var hasattack = false;
            //This normalizes the attack time-series
            angular.forEach(requests, function(request){
              if(request.attack){
                hasattack = true;
              }
            });
            //no attacks fill time slot with 0
            if(!hasattack){
              att.values.push([d, 0]);
            }
          });
          console.log(reqs);
          console.log(att);
          return [att, reqs];
        }
        else {
          return [];
        }
      }
   };

   return traffic;
  }]);
