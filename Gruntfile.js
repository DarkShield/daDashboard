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
      backend: {
        files: [
          'app/lib/*.js',
          'app/model/*.js',
          'app/routes/router.js',
          'app/app.js',
          'app/server.js',
          'spec/node/unit/*.*.js'
        ],
        tasks: ['jasmine_node:dev']
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
      dev: {
          options: {
            coverage: false,
            specFolders: ['./spec/node'],
            forceExit: true,
            match: '.',
            matchall: false,
            extensions: 'js',
            specNameMatcher: 'spec'
          },
          src: ['**/*.js']
      },
      cov: {
        options: {
          specFolders: ['./spec/node'],
          forceExit: true,
          match: '.',
          matchall: false,
          extensions: 'js',
          specNameMatcher: 'spec'
        },
        src: ['**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node-coverage');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('backend', ['env:dev', 'jasmine_node:dev']);
  grunt.registerTask('backend:cov', ['env:dev', 'jasmine_node:cov']);
  grunt.registerTask('frontend:unit:coverage', ['karma:unit_coverage']);
  grunt.registerTask('frontend:unit', ['karma:unit']);

  grunt.registerTask('test:unit:cov', ['karma:unit_coverage', 'jasmine_node:cov']);
  grunt.registerTask('test:unit', ['karma:unit', 'jasmine_node:dev']);
  grunt.registerTask('autotest:backend',['watch:backend']);
};