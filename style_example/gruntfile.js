module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // The node target must also be configured in .babelrc for npm run serverDev (babel-node)
  const nodeTarget = 4;
  const browserTargets = {
    'ie': 11,
    'browsers': ['last 2 versions', 'last 5 Chrome versions', 'last 5 Firefox versions', 'Firefox ESR'],
  };

  grunt.initConfig({
    env: { // Setting the BABEL_ENV environment variable to use the correct babel config
      server: {
        BABEL_ENV: 'server',
      },
      babili: {
        BABEL_ENV: 'babili',
      },
    },

    babel: {
      options: {
        env: { // BABEL_ENV configs
          server: { // Transpiling for the server
            presets: [
              ['env', {
                'targets': {
                  'node': nodeTarget,
                },
                'debug': false,
              }],
            ],
            plugins: ['dynamic-import-node'],
          },
          babili: { // Minifying
            presets: [
              ['babili'],
            ],
          },
        },
      },
      server: { // Transpiling for the server
        files: [{
          expand: true,
          cwd: 'src/server/',
          src: ['**/*.js'],
          dest: 'dist/server',
          ext: '.js',
        }, {
          expand: true,
          cwd: 'src/common/',
          src: ['**/*.js'],
          dest: 'dist/common',
          ext: '.js',
        }],
      },
      babili: { // Minifying the browser bundle
        files: {
          'html/js/bundle.js': 'html/js/bundle.js',
        },
      },
    },

    copy: { // Copy index.html from src to html
      'html/index.html': 'src/client/index.html',
    },

    browserify: {
      development: { // Transpile and bundle for development and watch for changes
        src: 'src/client/**/*.js',
        dest: 'html/js/bundle.js',
        options: {
          browserifyOptions: {
            debug: true,
          },
          transform: [
            ['babelify', {
              'presets': [
                ['env', {
                  'targets': browserTargets,
                  'debug': true,
                }],
              ],
            }],
          ],
          watch: true,
          keepAlive: true,
        },
      },
      production: { // Transpile and bundle for production
        src: 'src/client/**/*.js',
        dest: 'html/js/bundle.js',
        options: {
          browserifyOptions: {
            debug: false,
          },
          transform: [
            ['babelify', {
              'presets': [
                ['env', {
                  'targets': browserTargets,
                }],
              ],
            }],
          ],
        },
      },
    },
  });

  // Build all
  grunt.registerTask('default', ['env:server', 'babel:server', 'copy', 'browserify:production', 'env:babili',
    'babel:babili']);
  // Build the client
  grunt.registerTask('client', ['copy', 'browserify:production', 'env:babili', 'babel:babili']);
  // Build the server
  grunt.registerTask('server', ['env:server', 'babel:server']);
  // Build the client and watch for changes
  grunt.registerTask('clientDev', ['copy', 'browserify:development']);
};
