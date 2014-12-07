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
        var groupedByAttackBool = $filter('groupBy')(traffic.requests, 'attack');
        return groupedByAttackBool.true
      },

      getDetails: function(id, callback){
        return $http.post('/traffic/request-details', {id: id}).then(function(response){
          return response.data;
        });
      }
   };
   return traffic;
  }]);
