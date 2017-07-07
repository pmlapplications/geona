// Allow magic numbers in this file
/* eslint no-magic-numbers: 0 */
module.exports = {
  'root': true,
  // Use babel-eslint to support newer sytax
  'parser': 'babel-eslint',
  'parserOptions': {
    'sourceType': 'module',
    'allowImportExportEverywhere': false,
  },
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  // Extend from eslint:recommended and google
  // https://github.com/google/eslint-config-google
  'extends': ['eslint:recommended', 'google'],
  'rules': {
    /**
     * See http://eslint.org/docs/rules/
     *
     * 0 = off
     * 1 = warn
     * 2 = error
     *
     * If you have a rare, but sensible, use for something defined as an error,
     * then downgrade it to a warn.
     */

    // Possible Errors
    // Leave these mostly to eslint:recommended and google
    'no-cond-assign': 2, // override google
    'no-console': [1, {'allow': ['warn', 'error']}],

    // Best Practices
    // Specify all we want (to be clear)
    'block-scoped-var': 2,
    'class-methods-use-this': 1,
    'consistent-return': 1,
    'curly': 2,
    'dot-notation': 1,
    'eqeqeq': 1,
    'guard-for-in': 2, // google
    'no-alert': 1,
    'no-caller': 2, // google
    'no-case-declarations': 2, // eslint:recommended
    'no-div-regex': 2,
    'no-empty-function': 1,
    'no-empty-pattern': 2, // eslint:recommended
    'no-eq-null': 2,
    'no-eval': 2,
    'no-extend-native': 2, // google
    'no-extra-bind': 2, // google
    'no-extra-label': 2,
    'no-fallthrough': 2, // eslint:recommended
    'no-floating-decimal': 2,
    'no-global-assign': 2, // eslint:recommended
    'no-implicit-coercion': 2,
    'no-implicit-globals': 2,
    'no-implied-eval': 2,
    'no-invalid-this': 2, // google
    'no-iterator': 2,
    'no-labels': 2,
    'no-lone-blocks': 2,
    'no-loop-func': 2,
    'no-multi-spaces': 2, // google
    'no-multi-str': 2, // google
    'no-new': 2,
    'no-new-func': 2,
    'no-new-wrappers': 2, // google
    'no-octal': 2, // eslint:recommended
    'no-octal-escape': 2,
    'no-param-reassign': 1,
    'no-proto': 2,
    'no-redeclare': 2, // eslint:recommended
    'no-return-assign': 2, // If you must do this, wrap the assignment in parentheses and it will be allowed
    'no-return-await': 2,
    'no-script-url': 2,
    'no-self-assign': 2, // eslint:recommended
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-throw-literal': 2, // google
    'no-unmodified-loop-condition': 1,
    'no-unused-expressions': 2,
    'no-unused-labels': 2, // eslint:recommended
    'no-useless-call': 2,
    'no-useless-concat': 2,
    'no-useless-escape': 2,
    'no-useless-return': 2,
    'no-void': 1,
    'no-warning-comments': 1,
    'no-with': 2, // google
    'prefer-promise-reject-errors': 2,
    'radix': [1, 'as-needed'],
    'require-await': 2,
    'wrap-iife': [1, 'outside'],
    'yoda': 1,

    // Variables
    // Specify all we want (to be clear)
    'no-delete-var': 2, // eslint:recommended
    'no-label-var': 2,
    'no-shadow': [1, {'builtinGlobals': false}],
    'no-shadow-restricted-names': 2,
    'no-undef': 2, // eslint:recommended
    'no-undef-init': 2,
    'no-unused-vars': [1, {'vars': 'all', 'args': 'after-used'}], // eslint:recommended
    'no-use-before-define': [2, {'functions': false}],

    // Stylistic Issues
    // Leave these mostly to google
    'indent': [2, 2],
    'linebreak-style': [2, 'unix'],
    'max-len': [1, {'code': 120, 'tabWidth': 2, 'ignoreTrailingComments': true, 'ignoreUrls': true}], // override google
    'new-cap': [2, {'capIsNewExceptions': ['express.Router']}], // override google to add expceptions
    'require-jsdoc': [1, { // override google
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
      },
    }],

    // ECMAScript 6
    // Leave these to eslint:recommended and google
  },
};
