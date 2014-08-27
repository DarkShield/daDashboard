angular.module('App.Services')

  .factory('domainService', ['$http', '$rootScope', function($http, $rootScope){
    'use strict';

    var domains = {
      doms:[
        //{name: 'test', selected: '', requestData:{}}
      ],

      toggleAttack: function(id, attack) {
        $http.post('/toggle/attack', {id: id, attack: attack});
      },

      toggleBlock: function(ip, host, blocked, domains) {
        console.log(blocked);
        var data = {ip: ip, host: host, blocked: blocked, domains: domains};
        $http({
          method: 'POST',
          url: '/toggle/block',
          data: data,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        //$http.post('/toggle/block', {ip: ip, host: host, blocked: blocked, domains: domains});
      },

      getDomains: function(){
        domains.doms = [];
        $http.get('/domains').success(function(body){
          domains.doms = body;
          //$rootScope.$broadcast('Domain.data', body);
        });
      },

      getDoms: function(){
        return domains.doms
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
      },

      countUsers: function(range) {
        $http.post('/count/users', range).success(function(body){
          $rootScope.$broadcast('Users.count', body);
        });
      }
   };
   return domains;
  }]);
