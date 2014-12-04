/**
 * Created by mattjohansen on 1/1/14.
 */
module.exports = function(grunt) {
  grunt.initConfig({

    env : {
      options : {
        //Shared Options Hash
      },
      dev : {
        NODE_ENV : 'development'
      }
    },

    watch: {
      assets: {
        files: [
          'app/lib/*.js',
          'app/model/*.js',
          'app/routes/router.js',
          'app/app.js',
          'app/server.js',
          'spec/node/unit/*.*.js'
        ],
        tasks: ['jasmine_node']
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
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('backend', ['env:dev', 'jasmine_node']);
  grunt.registerTask('frontend', ['karma:unit_coverage']);
  grunt.registerTask('frontend:unit', ['karma:unit']);

  grunt.registerTask('test:unit', ['karma:unit_coverage', 'jasmine_node']);
  grunt.registerTask('autotest',['watch:assets']);
};