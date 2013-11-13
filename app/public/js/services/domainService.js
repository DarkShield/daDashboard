angular.module('App.domainService', [])

  .factory('domainService', ['$http', '$rootScope', function($http, $rootScope){
    'use strict';

    var domains = {
      doms:[
        //{name: 'test', selected: '', requestData:{}}
      ],

      toggleAttack: function(id, attack) {
        $http.post('/toggle/attack', {'id': id, 'attack': attack});
      },

    getDomains: function(){
      domains.doms = [];
      $http.get('/domains').success(function(body){
        domains.doms = body;
        $rootScope.$broadcast('Domain.data', body);
      });
    },

    getRequestData: function(domain){
      $http.post('/domains/info', domain).success(function(body){
        domain.requestData = body;
        $rootScope.$broadcast('Request.data', body);
      });
      $http.post('/domains/attacks', domain).success(function(body){
        domain.attacks = body;
      });
    },

    getLastDay: function(domain){
      $http.post('/domains/info/lastday', domain).success(function(body){
        domain.requestData = body;
        $rootScope.$broadcast('Request.data', body);
      });
    },

    getRange: function(range){
      $http.post('/traffic', range).success(function(body){
        $rootScope.$broadcast('Request.data', body);
      });
    },


    getSelectedSite: function(){
      var selectedsite = {};
      for (var dom in domains.doms){
        if(domains.doms[dom].selected === 'active'){
          selectedsite = domains.doms[dom];
        }
      }
      return selectedsite;
    }
   }
   return domains;
  }]);
