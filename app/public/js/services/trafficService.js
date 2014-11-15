angular.module('App.Services')

  .factory('trafficService', ['$http', function($http){
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

      getRequests: function(){
        return traffic.requests
      }
   };
   return traffic;
  }]);
