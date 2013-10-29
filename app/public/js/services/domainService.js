angular.module('App.domainService', [])

  .factory('domainService', ['$http', '$rootScope', function($http, $rootScope){
    'use strict';

    var domains = {
      doms:[
        //{name: 'test', selected: '', requestData:{}}
      ],

    getDomains: function(){
      $http.get('/domains').success(function(body){
        angular.forEach(body, function(domain){
          domains.doms.push(domain);
        });
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
      //$http.post('/domains/attacks', domain).success(function(body){
      //  domain.attacks = body;
      //});
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
