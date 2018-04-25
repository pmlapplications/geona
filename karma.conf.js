// Karma configuration
// Generated on Mon Oct 23 2017 16:32:11 GMT+0100 (BST)

module.exports = function(config) {
  config.set({
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // 'static/js/vendor.js': ['browserify'],
      'bac_src/**/*.js': ['browserify'],
      'bac_test/**/*.js': ['browserify'],
      'node_modules/chai-as-promised/lib/chai-as-promised.js': ['browserify'],
    },

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jquery-3.2.1', 'mocha', 'chai-as-promised', 'chai'],

    plugins: [
      'karma-jquery',
      'karma-browserify',
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-html2js-preprocessor',
      'karma-chai',
      'karma-chai-as-promised',
    ],


    browserify: {
      debug: true,
      transform: [
        ['babelify', {plugins:
          ['dynamic-import-node',
            ['transform-runtime', {
              'helpers': false,
              'polyfill': false,
              'regenerator': true,
              'moduleName': 'babel-runtime',
            },
            ]],
        presets: [['env',
          {
            'debug': false,
            'targets': {
              'node': 4,
            },
          }]],
        }],
      ],
    },

    // list of files / patterns to load in the browser
    files: [
      'bac_src/**/*.js',
      'bac_test/**/*.js',

    ],

    // list of files to exclude
    exclude: [
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};
