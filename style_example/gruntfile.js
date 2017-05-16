module.exports = function(grunt) {
   require('load-grunt-tasks')(grunt);

   grunt.initConfig({
      babel: {
         options: {
            presets: ['es2015']
         },
         dist: {
            files: [{
               expand: true,
               cwd: 'src/server/',
               src: ['**/*.js'],
               dest: 'dist/server',
               ext: '.js'
            },
            {
               expand: true,
               cwd: 'src/common/',
               src: ['**/*.js'],
               dest: 'dist/common',
               ext: '.js'
            }]
         }
      },
      copy: {
         'html/index.html': 'src/client/index.html'
      },
      browserify: {
         development: {
            src: 'src/client/**/*.js',
            dest: 'html/js/bundle.js',
            options: {
               browserifyOptions: {
                  debug: true
               },
               transform: [
                  ["babelify", {
                     "presets": ["es2015"]
                  }]
               ],
               watch: true,
               keepAlive: true
            }
         },
         production: {
            src: 'src/client/**/*.js',
            dest: 'html/js/bundle.js',
            options: {
               browserifyOptions: {
                  debug: false
               },
               transform: [
                  ["babelify", {
                     "presets": ["es2015"]
                  }]
               ],
               plugin: [
                  ["minifyify", {
                     map: false
                  }]
               ]
            }
         }
      }
   });

   grunt.registerTask('default', ['babel', 'copy', 'browserify:production']);
   grunt.registerTask('dev', ['babel', 'copy', 'browserify:development']);
};