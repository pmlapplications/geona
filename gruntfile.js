module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    babel: {
      server: { // Transpiling for the server
        files: [{
          expand: true,
          cwd: 'src/server/',
          src: ['**/*.js'],
          dest: 'lib/server',
          ext: '.js',
        }, {
          expand: true,
          cwd: 'src/common/',
          src: ['**/*.js'],
          dest: 'lib/common',
          ext: '.js',
        }],
      },
      babili: { // Minifying the browser bundle
        files: {
          'static/js/bundle.js': 'static/js/bundle.js',
        },
      },
    },

    browserify: {
      development: { // Transpile and bundle for development and watch for changes
        src: 'src/client/**/*.js',
        dest: 'static/js/bundle.js',
        options: {
          browserifyOptions: {
            debug: true,
          },
          transform: [
            ['babelify'],
          ],
          watch: true,
          keepAlive: true,
        },
      },
      production: { // Transpile and bundle for production
        src: 'src/client/**/*.js',
        dest: 'static/js/bundle.js',
        options: {
          browserifyOptions: {
            debug: false,
          },
          transform: [
            ['babelify'],
          ],
        },
      },
    },

    clean: {
      client: ['static'],
      server: ['lib'],
    },

    copy: { // Copy index.html from src to static
      'static/index.html': 'src/client/index.html',
    },

    env: { // Setting the BABEL_ENV environment variable to use the correct .babelrc config
      server: {
        BABEL_ENV: 'server',
      },
      babili: {
        BABEL_ENV: 'babili',
      },
      babelify: {
        BABEL_ENV: 'babelify',
      },
    },

    sass: {
      development: {
        options: {
          sourcemap: 'inline',
          style: 'nested',
        },
        files: {
          'static/css/main.css': 'src/client/scss/main.scss',
        },
      },
      production: {
        options: {
          sourcemap: 'none',
          style: 'compressed',
        },
        files: {
          'static/css/main.css': 'src/client/scss/main.scss',
        },
      },
    },
  });

  // Build all
  grunt.registerTask('default', ['server', 'client']);
  // Build the server
  grunt.registerTask('server', ['clean:server', 'env:server', 'babel:server']);
  // Build the client
  grunt.registerTask('client', ['clean:client', 'copy', 'sass:production', 'env:babelify', 'browserify:production',
    'env:babili', 'babel:babili']);
  // Build the client and watch for changes
  grunt.registerTask('clientDev', ['clean:client', 'copy', 'sass:development', 'env:babelify',
    'browserify:development']);
};
