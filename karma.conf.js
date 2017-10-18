// https://sean.is/writing/client-side-testing-with-mocha-and-karma
module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['mocha'],

    files: [],

    exclude: [

    ],

    preprocessors: {
      'test/client/index.html': ['html2js'],
    },

    reporters: ['progress'],

    port: 7890,

    colors: true,

    autoWatch: false,

    browsers: [],

    singleRun: false,

    logLevel: config.LOG_INFO,

  });
};
