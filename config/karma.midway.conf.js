// Karma configuration
// Generated on Wed Jun 12 2013 18:28:36 GMT-0500 (CDT)


// base path, that will be used to resolve files and exclude
basePath = '../';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  
  //Tests to Include
  './spec/angular/midway/*.js',
  
  //Testing Tools
  './config/ngMidwayTester.js',

  //Third Party
  './app/public/js/vendor/angular.min.js',
  './app/public/js/vendor/jquery.min.js',
  './app/public/js/directives/angular-strap/dist/angular-strap.js',

  //Application Code
  './app/public/js/dashboard.js',
  './app/public/js/controllers/*.js',
  //'./app/public/js/directives/*.js',
  './app/public/js/services/*.js'
 
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = [ 'Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;