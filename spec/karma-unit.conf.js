/**
 * Created by mattjohansen on 1/1/14.
 */
module.exports = function(config) {
  config.set({
    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/public/js/dashboard.js',
      'app/public/js/controllers/sidebarCtrl.js',
      'app/public/js/controllers/trafficCtrl.js',
      'app/public/js/services/domainService.js',
      'app/public/js/services/drilldownService.js',
      'spec/angular/unit/**/*.js'
    ],
    basePath: '../',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};