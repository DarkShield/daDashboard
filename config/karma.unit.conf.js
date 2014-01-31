// Karma configuration
// Generated on Thu Oct 17 2013 17:25:37 GMT-0500 (CDT)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [

            //Include Vendor Files
            './app/public/js/vendor/angular/angular.js',
            './app/public/js/vendor/angular/angular-mocks.js',
            './app/public/js/vendor/ui-bootstrap-tpls-0.6.0.js',
            './app/public/js/directives/angular-strap/dist/angular-strap.js',

            //Include App Code
            './app/public/js/dashboard.js',
            './app/public/js/services/*.js',
            './app/public/js/controllers/*.js',

            //Include Unit Tests
            './spec/angular/unit/*.spec.js'
        ],


        // list of files to exclude
        exclude: [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
