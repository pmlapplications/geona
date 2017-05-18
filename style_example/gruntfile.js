module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // The node target must also be configured in .babelrc for npm run serverDev (babel-node)
  const nodeTarget = 4;
  const browserTargets = {
    'ie': 11,
    'browsers': ['last 2 versions', 'last 6 chrome versions']
  };

  grunt.initConfig({
    babel: {
      options: {
        presets: [
          ['env', {
            'targets': {
              'node': nodeTarget
            },
            'debug': false
          }]
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/server/',
          src: ['**/*.js'],
          dest: 'dist/server',
          ext: '.js'
        }, {
          expand: true,
          cwd: 'src/common/',
          src: ['**/*.js'],
          dest: 'dist/common',
          ext: '.js'
        }]
      }
    },
    copy: {
      'html/index.html': 'src/client/index.html'
    },
    browserify: {
      development: {
        src: 'src/client/**/*.js',
        dest: 'html/js/bundle.js',
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: [
            ['babelify', {
              'presets': [
                ['env', {
                  'targets': browserTargets,
                  'debug': true
                }]
              ]
            }]
          ],
          watch: true,
          keepAlive: true
        }
      },
      production: {
        src: 'src/client/**/*.js',
        dest: 'html/js/bundle.js',
        options: {
          browserifyOptions: {
            debug: false
          },
          transform: [
            ['babelify', {
              'presets': [
                ['env', {
                  'targets': browserTargets
                }]
              ]
            }]
          ],
          plugin: [
            ['minifyify', {
              map: false
            }]
          ]
        }
      }
    }
  });

  // Build all
  grunt.registerTask('default', ['babel', 'copy', 'browserify:production']);
  // Build the client
  grunt.registerTask('client', ['copy', 'browserify:production']);
  // Build the server
  grunt.registerTask('server', ['babel']);
  // Build the client and watch for changes
  grunt.registerTask('clientDev', ['copy', 'browserify:development']);
};
