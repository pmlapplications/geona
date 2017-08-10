/**
 * Extends the normal .eslintrc file, and then google to upgrade various warnings to errors.
 */

module.exports = {
  'extends': ['./.eslintrc.js', 'google'],
  'rules': {
    /*
     * Add any non google rules we need to upgrade to errors,
     * and override any google rules we need to.
     */

    // Possible Errors
    'no-cond-assign': 2, // override google
    'valid-jsdoc': [2, { // override google to add more options
      requireParamDescription: false,
      requireReturnDescription: false,
      requireReturn: false,
      prefer: {returns: 'return'},
      preferType: {
        object: 'Object',
        array: 'Array',
        string: 'String',
        number: 'Number',
        boolean: 'Boolean',
      },
    }],

    // Variables
    'no-unused-vars': [2, {'vars': 'all', 'args': 'after-used'}], // override google to add options

    // Stylistic Issues
    'linebreak-style': [2, 'unix'], // override google to be explicit
    'max-len': [2, { // override google to change options
      'code': 120,
      'tabWidth': 2,
      'ignoreStrings': true,
      'ignoreTrailingComments': true,
      'ignoreUrls': true,
    }],
    'new-cap': [2, { // override google to add expceptions
      'capIsNewExceptions': ['express.Router'],
    }],
  },
};
