angular.module('App.Services', [])

  .factory('domainService', ['$http', function($http){
    'use strict';

    var domains = {
      doms:[
        //{name: 'test', selected: '', requestData:{}}
      ],

    getDomains: function(){
      $http.get('/domains').success(function(body){
        for (var domain in body){
          domains.doms.push(body[domain]);
        }
      });
    },

    getRequestData: function(domain){
      $http.post('/domains/info', domain).success(function(body){
        domain.requestData = body;
        console.log(body);
      });
      $http.post('/domains/attacks', domain).success(function(body){
        domain.attacks = body;
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
