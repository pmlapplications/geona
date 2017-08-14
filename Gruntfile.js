module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  let clientBundle = {
    'static/js/bundle.js': 'src/client/js/geona.js',
  };

  let loaderBundle = {
    'static/js/loader.js': 'src/client_loader/loader.js',
  };

  let vendorLibs = [
    'babel-runtime/regenerator',
    'convict',
    'handlebars/runtime',
    'i18next',
    'i18next-browser-languagedetector',
    'i18next-xhr-backend',
    'jquery',
    'jquery-ui/ui/widgets/sortable',
    'lodash',
  ];

  let leafletPlugins = [
    './src/client/vendor/js/leaflet_latlng_graticule.js',
  ];

  let clientExternalLibs = vendorLibs.concat(leafletPlugins).concat([
    'openlayers',
    'leaflet',
  ]);

  let cssFiles = {
    'static/css/main.css': 'src/client/scss/main.scss',
  };

  let eslintFiles = [
    'src/**/*.js',
    '!src/client/vendor/**',
    '!src/client/templates/**',
  ];

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
      // Default browserify options
      options: {
        browserifyOptions: {
          standalone: 'geona',
          debug: true,
        },
        transform: [
          'babelify',
          ['deamdify', {global: true}],
        ],
        external: clientExternalLibs,
      },

      // Make client bundle
      client: {
        files: clientBundle,
        options: {
          watch: true,
        },
      },

      // Make the loader bundle
      loader: {
        files: loaderBundle,
        options: {
          browserifyOptions: {
            standalone: 'gp2Loader',
            debug: true,
          },
          external: null,
          watch: true,
        },
      },

      // Make the main vendor bundle with all the common libraries
      vendor: {
        src: ['.'],
        dest: 'static/js/vendor.js',
        options: {
          browserifyOptions: {},
          alias: vendorLibs,
          external: null,
        },
      },

      // Make the openlayers and leaflet bundles
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
          alias: ['leaflet'].concat(leafletPlugins),
          external: null,
        },
      },
    },

    clean: {
      client: ['static'],
      server: ['lib'],
    },

    copy: {
      client: {
        files: [
          {
            expand: true,
            cwd: 'src/client/vendor/fonts',
            src: ['*'],
            dest: 'static/vendor/fonts',
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
        src: eslintFiles,
      },
      check: {
        src: eslintFiles,
      },
      strict: {
        options: {
          configFile: '.eslintrc_strict.js',
        },
        src: eslintFiles,
      },
    },

    handlebars: {
      compile: {
        options: {
          namespace: '',
          exportCommonJS: 'handlebars/runtime',
          returnTemplates: true,
        },
        files: {
          'src/client/templates/compiled.js': 'src/client/templates/*.hbs',
        },
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
      // eslint: {
      //   files: ['src/**/*.js'],
      //   tasks: ['eslint:fix'],
      // },
      handlebars: {
        files: ['src/client/templates/*.hbs'],
        tasks: ['handlebars'],
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
  grunt.registerTask('client', ['clean:client', 'copy:client', 'sass:production', 'handlebars', 'env:babelify', 'browserify:client',
    'browserifyOther', 'env:babili', 'babel:babili']);
  // Build the client and watch for changes
  grunt.registerTask('clientDev', ['eslint:fix', 'clean:client', 'copy:client', 'sass:development', 'handlebars', 'env:babelify',
    'browserify:client', 'browserifyOther', 'watch']);

  grunt.registerTask('browserifyOther', ['browserify:loader', 'browserify:vendor', 'browserify:openlayers', 'browserify:leaflet']);
};
