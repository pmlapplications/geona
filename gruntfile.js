module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    babel: {
      server: { // Transpiling for the server
        files: [
          {
            expand: true,
            cwd: 'src/server/',
            src: ['**/*.js'],
            dest: 'lib/server',
            ext: '.js',
          },
          {
            expand: true,
            cwd: 'src/common/',
            src: ['**/*.js'],
            dest: 'lib/common',
            ext: '.js',
          },
        ],
      },
      babili: { // Minifying the browser bundle
        files: {
          'static/js/bundle.js': 'static/js/bundle.js',
        },
      },
    },

    browserify: {
      development: { // Transpile and bundle for development and watch for changes
        files: {
          'static/js/bundle_openlayers.js': 'src/client/js/main_openlayers.js',
          'static/js/bundle_leaflet.js': 'src/client/js/main_leaflet.js',
          'static/js/loader.js': 'src/client/js/loader.js',
        },
        options: {
          browserifyOptions: {
            standalone: "gp2",
            debug: true,
          },
          transform: [
            ['babelify'],
          ],
          watch: true,
          // keepAlive: true,
        },
      },
      production: { // Transpile and bundle for production
        files: {
          'static/js/bundle_openlayers.js': 'src/client/js/main_openlayers.js',
          'static/js/bundle_leaflet.js': 'src/client/js/main_leaflet.js',
          'static/js/loader.js': 'src/client/js/loader.js',
        },
        options: {
          browserifyOptions: {
            standalone: "gp2",
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
      // 'static/index.html': 'src/client/index.html',
      default: {
        files: [
        // 'static/index.html': 'src/client/index.html',
          // {
          //   src: 'src/client/index.html',
          //   dest: 'static/index.html',
          // },
          {
            expand: true,
            cwd: 'src/client/fonts',
            src: ['*'],
            dest: 'static/fonts',
          },
        ],
      },
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

    watch: {
      html: {
        files: ['src/client/index.html'],
        tasks: ['copy'],
      },
      sass: {
        files: ['src/client/scss/*.scss'],
        tasks: ['sass:development'],
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
    'browserify:development', 'watch:sass']);
};
