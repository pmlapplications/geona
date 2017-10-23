module.exports = function(config) {
  config.set({
    basePath: '../',

    files: [
      // Tutorial includes Angular files here - do we have an equivalent?
      // Polyfill for PhantomJS and IE
      'node_modules/babel-polyfill/dist/polyfill.js',

      'node_modules/chai/chai.js',

      // Our JS files
      // 'static/js/map_leaflet_es5.js',
      'test/client/index.html',

      // Our unit test files
      // 'static/js/client_tests.js',


      // html2js preprocessor takes this file
      // 'test/client/index.html',

    ],

    exclude: [],

    autoWatch: false,

    frameworks: ['mocha'],

    browsers: ['PhantomJS', 'Firefox'],

    reporters: ['progress'],

    preprocessors: {
      'test/client/index.html': ['html2js'],
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-html2js-preprocessor',
    ],
  });
};
