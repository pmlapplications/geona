module.exports = function(config) {
  config.set({
    basePath: '../',

    files: [
      // Tutorial includes Angular files here - do we have an equivalent?
      // Polyfill for phantomjs
      'node_modules/babel-polyfill/dist/polyfill.js',

      // Our JS files
      'static/js/map_common_es5.js',

      // Our unit test files
      'static/js/client_tests.js',

    ],

    exclude: [],

    autoWatch: false,

    frameworks: ['mocha'],

    browsers: ['PhantomJS', 'Firefox'],

    reporters: ['progress'],

    preprocessors: {},

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha',
    ],
  });
};
