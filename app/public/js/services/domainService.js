angular.module('App.Services')

  .factory('domainService', ['$http', function($http){
    'use strict';

    var domains = {
      doms:[
        //{name: 'test', selected: '', requestData:{}}
      ],

      fetchDomains: function(){
        domains.doms = [];
        $http.get('/domains').success(function(body){
          domains.doms = body;
        });
      },

      getDomains: function(){
        return domains.doms
      },

      getRequestData: function(domain){
        $http.post('/domains/info', domain).success(function(body){
          domain.requestData = body;
        });
        $http.post('/domains/attacks', domain).success(function(body){
          domain.attacks = body;
        });
      },

      getLastDay: function(domain){
        $http.post('/domains/info/lastday', domain).success(function(body){
          domain.requestData = body;
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
   };
   return domains;
  }]);
