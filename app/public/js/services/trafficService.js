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

      getRange: function(range){
        $http.post('/traffic', range).success(function(body){
          traffic.requests = body;
        });
      },

      getSessions: function(){
        return $filter('groupBy')(traffic.requests, 'dstc')
      },

      getIPs: function(){
        return $filter('groupBy')(traffic.requests, 'remoteIP')
      },

      getAttacks: function(){
        var groupedByAttackBool = $filter('groupBy')(traffic.requests, 'attack');
        return groupedByAttackBool.true
      }


   };
   return traffic;
  }]);
