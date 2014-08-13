/**
 * Created by mattjohansen on 1/1/14.
 */

module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    shell: {
      options: {
        stdout: true
      },
      selenium: {
        command: './selenium/start',
        options: {
          stdout: false,
          async: true
        }
      },
      protractor_install: {
        command: 'node ./node_modules/protractor/bin/webdriver-manager update'
      },
      npm_install: {
        command: 'npm install'
      }
    },

    connect: {
      options: {
        base: 'app/'
      },
      webserver: {
        options: {
          port: 8888,
          keepalive: true
        }
      },
      devserver: {
        options: {
          port: 8888
        }
      },
      testserver: {
        options: {
          port: 9999
        }
      },
      coverage: {
        options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      }
    },

    protractor: {
      options: {
        keepAlive: true,
        configFile: "./spec/protractor.conf.js"
      },
      singlerun: {},
      auto: {
        keepAlive: true,
        options: {
          args: {
            seleniumPort: 4444
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/public/js/{,*/}*.js',
        'app/public/js/controllers/{,*/}*.js',
        'app/public/js/directives/{,*/}*.js',
        'app/public/js/services/{,*/}*.js',
        'app/public/js/filters/{,*/}*.js'
      ]
    },

    concat: {
      styles: {
        dest: './app/assets/app.css',
        src: [
          'app/public/css/application.css',
          'app/public/css/bootstrap-combined.min.css',
          'app/public/css/customizations.css'
          //place your Stylesheet files here
        ]
      },
      scripts: {
        options: {
          separator: ';'
        },
        dest: './app/assets/app.js',
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-route/angular-route.js',
          'app/public/js/controllers/sidebarCtrl.js',
          'app/public/js/controllers/trafficCtrl.js',
          'app/public/js/services/domainService.js',
          'app/public/js/services/drilldownService.js',
          'app/public/js/filters/domainFilter.js',
          'app/public/js/dashboard.js'
          //place your JavaScript files here
        ]
      }
    },

    watch: {
      options : {
        livereload: 7777
      },
      assets: {
        files: ['app/public/css/**/*.css','app/public/js/**/*.js'],
        tasks: ['concat']
      },
      protractor: {
        files: ['app/public/js/**/*.js','spec/angular/e2e/**/*.js'],
        tasks: ['protractor:auto']
      }
    },

    open: {
      devserver: {
        path: 'http://localhost:8888'
      },
      coverage: {
        path: 'http://localhost:5555'
      }
    },

    karma: {
      unit: {
        configFile: './config/karma.unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: './config/karma.unit.conf.js',
        autoWatch: true,
        singleRun: false
      },
      unit_coverage: {
        configFile: './config/karma.unit.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'app/scripts/*.js': ['coverage']
        },
        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        }
      }
    },

    jasmine_node: {
      coverage: {
        options : {
          failTask: true,
          branches : 83 ,
          functions: 98,
          statements:99,
          lines:99
        }
      },
      options: {
        forceExit: true,
        match: './spec/node/unit',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
        junitreport: {
          report: false,
          savePath : "./build/reports/jasmine/",
          useDotNotation: true,
          consolidate: true
        }
      }
    }
  });

  //single run tests
  grunt.registerTask('test', ['jshint','test:unit', 'test:e2e']);
  grunt.registerTask('test:unit', ['karma:unit', 'jasmine_node']);
  grunt.registerTask('test:e2e', ['connect:testserver','protractor:singlerun']);

  //autotest and watch tests
  grunt.registerTask('autotest', ['karma:unit_auto']);
  grunt.registerTask('autotest:unit', ['karma:unit_auto']);
  grunt.registerTask('autotest:e2e', ['connect:testserver','shell:selenium','watch:protractor']);

  //coverage testing
  grunt.registerTask('test:coverage', ['karma:unit_coverage']);
  grunt.registerTask('coverage', ['karma:unit_coverage','open:coverage','connect:coverage']);

  //installation-related
  grunt.registerTask('install', ['update','shell:protractor_install']);

  //defaults
  grunt.registerTask('default', ['dev']);


  //server daemon
  grunt.registerTask('serve', ['connect:webserver']);
};