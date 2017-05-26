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
        files: [{
          expand: true,
          cwd: 'static/i18n/',
          src: ['**/*.js'],
          dest: 'static/i18n/',
          ext: '.js',
        }, {
          'static/js/bundle.js': 'static/js/bundle.js',
        }],
      },
    },

    copy: { // Copy index.html from src to html
      'static/index.html': 'src/client/index.html',
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
        dest: 'static/js/bundle.js',
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

    abideExtract: {
      server: {
        src: 'dist/**/*.js',
        dest: 'locale/templates/LC_MESSAGES/messages.pot',
        options: {
          language: 'Javascript',
        },
      },
    },

    abideCreate: {
      default: {
        options: {
          template: 'locale/templates/LC_MESSAGES/messages.pot',
          languages: ['en', 'fr'],
          localeDir: 'locale',
        },
      },
    },

    abideMerge: {
      default: {
        options: {
          template: 'locale/templates/LC_MESSAGES/messages.pot',
          localeDir: 'locale',
        },
      },
    },

    abideCompile: {
      json: {
        dest: 'static/i18n',
        options: {
          type: 'json',
          localeDir: 'locale',
        },
      },
    },
  });

  // Build all
  grunt.registerTask('default', ['env:server', 'babel:server', 'copy', 'i18nCompile', 'browserify:production',
    'env:babili', 'babel:babili']);
  // Build the client
  grunt.registerTask('client', ['copy', 'browserify:production', 'env:babili', 'babel:babili']);
  // Build the server
  grunt.registerTask('server', ['env:server', 'babel:server']);
  // Build the client and watch for changes
  grunt.registerTask('clientDev', ['copy', 'i18nCompile', 'browserify:development']);
  // Extract strings from the program and build i18n files
  grunt.registerTask('i18nExtract', ['server', 'abideExtract', 'abideCreate', 'abideMerge']);
  // Compile the i18n files
  grunt.registerTask('i18nCompile', ['abideCompile']);
};
