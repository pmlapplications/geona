module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // grunt.loadNpmTasks('grunt-karma');

  let clientBundle = {
    'static/js/bundle.js': 'src/client/js/geona.js',
  };

  let loaderBundle = {
    'static/js/loader.js': 'src/client_loader/loader.js',
  };

  let clientTestsBundle = {
    'static/js/client_tests.js': 'test/client/js/map_leaflet.js',
  };

  let clientMapCommonBundle = {
    'static/js/map_common_es5.js': 'src/client/js/map_common.js',
  };

  let clientMapLeafletBundle = {
    'static/js/map_leaflet_es5.js': 'src/client/js/map_leaflet.js',
  };

  let vendorLibs = [
    'babel-runtime/regenerator',
    'convict',
    'eventemitter3',
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
    './src/client/vendor/js/leaflet_tilelayer_wmts.js',
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
    '!src/server/vendor/**',
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
        transform: [
          'babelify',
          ['deamdify', {global: true}],
        ],
      },

      // Make client bundle
      client: {
        files: clientBundle,
        options: {
          browserifyOptions: {
            standalone: 'geona',
            debug: true,
          },
          watch: true,
          external: clientExternalLibs,
        },
      },

      // Make the loader bundle
      loader: {
        files: loaderBundle,
        options: {
          browserifyOptions: {
            standalone: 'geonaLoader',
            debug: true,
          },
          watch: true,
        },
      },

      // Make the client tests bundle
      clientTests: {
        files: clientTestsBundle,
        options: {
          browserifyOptions: {
            standalone: 'geonaClientTests',
            debug: true,
          },
          watch: true,
        },
      },

      // Make the client map common bundle
      clientMapCommon: {
        files: clientMapCommonBundle,
        options: {
          browserifyOptions: {
            standalone: 'geonaClientMapCommon',
            debug: true,
          },
          watch: true,
        },
      },

      // Make the client map leaflet bundle
      clientMapLeaflet: {
        files: clientMapLeafletBundle,
        options: {
          browserifyOptions: {
            standalone: 'geonaClientMapLeaflet',
            debug: true,
          },
          watch: true,
        },
      },

      // Make the main vendor bundle with all the common libraries
      vendor: {
        src: ['.'],
        dest: 'static/js/vendor.js',
        options: {
          alias: vendorLibs,
        },
      },

      // Make the openlayers and leaflet bundles
      openlayers: {
        src: ['.'],
        dest: 'static/js/vendor_openlayers.js',
        options: {
          alias: ['openlayers'],
        },
      },
      leaflet: {
        src: ['.'],
        dest: 'static/js/vendor_leaflet.js',
        options: {
          alias: ['leaflet'].concat(leafletPlugins),
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
      test: {
        files: [
          {
            expand: true,
            cwd: 'test/client',
            src: ['index.html'],
            dest: 'static/test',
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

    jsdoc: {
      combined: {
        src: ['README.md'],
        dest: 'static/documentation',
      },
      client: {
        src: ['src/client/**/*.js', 'src/common/**/*.js', 'src/client/README.md'],
        dest: 'static/documentation/client',
      },
      client_loader: {
        src: ['src/client_loader/**/*.js', 'src/client_loader/README.md'],
        dest: 'static/documentation/client_loader',
      },
      server: {
        src: ['src/server/**/*.js', 'src/common/**/*.js', 'src/server/README.md'],
        dest: 'static/documentation/server',
      },
    },

    // karma: {
    //   options: {
    //     configFile: 'karma-conf.js',
    //     files: [
    //       'test/client/index.html',
    //     ],
    //   },
    //   unit: {
    //     singleRun: true,
    //   },
    //   dev: {
    //     singleRun: false,
    //   },
    // },

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
        files: ['src/client/templates/**/*.hbs'],
        tasks: ['handlebars'],
      },
      sass: {
        files: ['src/client/scss/**/*.scss'],
        tasks: ['sass:development'],
      },
    },
  });

  // Build all
  grunt.registerTask('default', ['server', 'client']);
  // Build the server
  grunt.registerTask('server', ['clean:server', 'copy:server', 'env:server', 'babel:server', 'jsdoc']);
  // Build the client
  grunt.registerTask('client', ['clean:client', 'copy:client', 'sass:production', 'handlebars', 'env:babelify', 'browserify:client',
    'browserifyOther', 'env:babili', 'babel:babili']);
  // Build the client and watch for changes
  grunt.registerTask('clientDev', ['eslint:fix', 'clean:client', 'copy:client', 'sass:development', 'handlebars', 'env:babelify',
    'browserify:client', 'browserifyOther', 'copy:test', 'watch']);

  grunt.registerTask('browserifyOther', ['browserify:loader', 'browserify:clientTests', 'browserify:clientMapCommon', 'browserify:clientMapLeaflet', 'browserify:vendor', 'browserify:openlayers', 'browserify:leaflet']);
};
