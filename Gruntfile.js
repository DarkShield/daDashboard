/**
 * Created by mattjohansen on 1/1/14.
 */
module.exports = function(grunt) {
  grunt.initConfig({

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

    karma: {
      unit : {
        configFile: './config/karma.unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_watch : {
        configFile: './config/karma.unit.conf.js',
        autoWatch: true,
        singleRun: false
      },
      unit_coverage: {
        configFile: './config/karma.unit.conf.js',
        autoWatch: false,
        singleRun: true
      }

    },

    jasmine_node: {
      coverage: {
        options : {
          failTask: false,
          branches : 83 ,
          functions: 98,
          statements:99,
          lines:99
        }
      },
      options: {
        specFolders: ['./spec/node'],
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'

      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node-coverage-validation');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('backend', ['jasmine_node']);
  grunt.registerTask('frontend', ['karma:unit_coverage']);
  grunt.registerTask('frontend:unit', ['karma:unit']);

  grunt.registerTask('test:unit', ['karma:unit_coverage', 'jasmine_node']);
  grunt.registerTask('autotest',['watch:assets']);
};