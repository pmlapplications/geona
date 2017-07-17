module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  let clientBundles = {
    'static/js/bundle.js': 'src/client/js/init.js',
    // 'static/js/bundle_openlayers.js': 'src/client/js/main_openlayers.js',
    // 'static/js/bundle_leaflet.js': 'src/client/js/main_leaflet.js',
    // 'static/js/loader.js': 'src/client/js/loader.js',
  };

  let loaderBundle = {
    'static/js/loader.js': 'src/client_loader/loader.js',
  };

  let cssFiles = {
    'static/css/main.css': 'src/client/scss/main.scss',
  };

  let vendorLibs = [
    'convict',
    'jquery',
    'lodash',
  ];

  let clientExternalLibs = vendorLibs.concat([
    'openlayers',
    'leaflet',
  ]);

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
        files: [
          {
            expand: true,
            cwd: 'static/js/',
            src: ['*.js'],
            dest: 'static/js/',
            ext: '.js',
          },
        ],
      },
    },

    browserify: {
      options: {
        browserifyOptions: {
          standalone: 'gp2',
          debug: true,
        },
        transform: [
          ['babelify'],
        ],
        external: clientExternalLibs,
      },
      development: { // Transpile and bundle for development and watch for changes
        files: clientBundles,
        options: {
          watch: true,
        },
      },
      production: { // Transpile and bundle for production
        files: clientBundles,
      },
      loader: {
        files: loaderBundle,
        options: {
          browserifyOptions: {
            standalone: 'gp2Loader',
            debug: true,
          },
          external: null,
        },
      },
      vendor: {
        src: ['.'],
        dest: 'static/js/vendor.js',
        options: {
          browserifyOptions: {},
          alias: vendorLibs,
          external: null,
        },
      },
      openlayers: {
        src: ['.'],
        dest: 'static/js/vendor_openlayers.js',
        options: {
          browserifyOptions: {},
          alias: ['openlayers'],
          external: null,
        },
      },
      leaflet: {
        src: ['.'],
        dest: 'static/js/vendor_leaflet.js',
        options: {
          browserifyOptions: {},
          alias: ['leaflet'],
          external: null,
        },
      },
    },

    clean: {
      client: ['static'],
      server: ['lib'],
    },

    copy: { // Copy index.html from src to static
      // 'static/index.html': 'src/client/index.html',
      client: {
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
      server: {
        files: [
          {
            expand: true,
            cwd: 'src/server/templates',
            src: ['*'],
            dest: 'lib/server/templates',
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

    eslint: {
      fix: {
        options: {
          fix: true,
        },
        src: [
          'src/**/*.js',
        ],
      },
      check: {
        src: [
          'src/**/*.js',
        ],
      },
    },

    sass: {
      development: {
        options: {
          sourcemap: 'inline',
          style: 'nested',
        },
        files: cssFiles,
      },
      production: {
        options: {
          sourcemap: 'none',
          style: 'compressed',
        },
        files: cssFiles,
      },
    },

    watch: {
      eslint: {
        files: ['src/**/*.js'],
        tasks: ['eslint:check'],
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
  grunt.registerTask('server', ['clean:server', 'copy:server', 'env:server', 'babel:server']);
  // Build the client
  grunt.registerTask('client', ['clean:client', 'copy:client', 'sass:production', 'env:babelify', 'browserify:production',
    'browserifyOther', 'env:babili', 'babel:babili']);
  // Build the client and watch for changes
  grunt.registerTask('clientDev', ['eslint:check', 'clean:client', 'copy:client', 'sass:development', 'env:babelify',
    'browserify:development', 'browserifyOther', 'watch']);

  grunt.registerTask('browserifyOther', ['browserify:loader', 'browserify:vendor', 'browserify:openlayers', 'browserify:leaflet']);
};
