module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": ["eslint:recommended", "google"],
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    /**
     * See http://eslint.org/docs/rules/
     *
     * 0 = off
     * 1 = warn
     * 2 = error
     *
     * Adapted from google, plus many extras.
     * https://github.com/google/eslint-config-google
     *
     * If you have a rare, but sensible, use for something defined as an error,
     * then downgrade it to a warn.
     */

    // Style
    "indent": [2, 2],
    "linebreak-style": [2, "unix"],
    "quotes": [2, "single"],
    "semi": [2, "always"],

    // Possible Errors
    // Mostly let eslint:recommended fill this
    "no-console": [1, { "allow": ["warn", "error"] }],
    'valid-jsdoc': [2, { // google
      requireParamDescription: false,
      requireReturnDescription: false,
      requireReturn: false,
      prefer: { returns: 'return' },
    }],

    // Best Practices
    // Specify all as eslint:recommended may change
    "block-scoped-var": 2,
    "class-methods-use-this": 2,
    "consistent-return": 1,
    "curly": 2,
    "dot-notation": 2,
    "eqeqeq": 1,
    'guard-for-in': 2, // google
    "no-alert": 1,
    'no-caller': 2, // google
    'no-case-declarations': 2, // eslint:recommended
    "no-div-regex": 2,
    "no-empty-function": 2,
    'no-empty-pattern': 2, // eslint:recommended
    "no-eq-null": 2,
    "no-eval": 2,
    'no-extend-native': 2, // google
    'no-extra-bind': 2, // google
    "no-extra-label": 2,
    'no-fallthrough': 2, // eslint:recommended
    "no-floating-decimal": 2,
    'no-global-assign': 2, // eslint:recommended
    "no-implicit-coercion": 2,
    "no-implicit-globals": 2,
    "no-implied-eval": 2,
    'no-invalid-this': 2, // google
    "no-iterator": 2,
    "no-labels": 2,
    "no-lone-blocks": 2,
    "no-loop-func": 2,
    "no-magic-numbers": [1, { "ignoreArrayIndexes": true }],
    'no-multi-spaces': 2, // google
    'no-multi-str': 2, // google
    "no-new": 2,
    "no-new-func": 2,
    'no-new-wrappers': 2, // google
    'no-octal': 2, // eslint:recommended
    "no-octal-escape": 2,
    "no-param-reassign": 1,
    "no-proto": 2,
    'no-redeclare': 2, // eslint:recommended
    "no-return-assign": 2,
    "no-return-await": 2,
    "no-script-url": 2,
    'no-self-assign': 2, // eslint:recommended
    "no-self-compare": 2,
    "no-sequences": 2,
    'no-throw-literal': 2, // google
    "no-unmodified-loop-condition": 1,
    "no-unused-expressions": 2,
    'no-unused-labels': 2, // eslint:recommended
    "no-useless-call": 2,
    "no-useless-concat": 2,
    "no-useless-escape": 2,
    "no-useless-return": 2,
    "no-void": 1,
    "no-warning-comments": 1,
    'no-with': 2, // google
    "prefer-promise-reject-errors": 2,
    "radix": [1, "as-needed"],
    "require-await": 2,
    "wrap-iife": [1, "outside"],
    "yoda": 1,

    // Variables
    // Specify all as eslint:recommended may change
    'no-delete-var': 2, // eslint:recommended
    "no-label-var": 2,
    "no-shadow": 2,
    "no-shadow-restricted-names": 2,
    'no-undef': 2, // eslint:recommended
    "no-undef-init": 2,
    'no-unused-vars': 2, // eslint:recommended
    "no-use-before-define": 2

    // Stylistic Issues
    'array-bracket-spacing': [2, 'never'], // google
    'brace-style': 2, // google
    'camelcase': [2, { properties: 'never' }], // google
    'comma-dangle': [2, 'always-multiline'], // google
    'comma-spacing': 2, // google
    'comma-style': 2, // google
    'computed-property-spacing': 2, // google
    'eol-last': 2, // google
    'func-call-spacing': 2, // google
    'key-spacing': 2, // google
    'keyword-spacing': 0, // google
    'linebreak-style': 2, // google
    'max-len': [2, { // google
      code: 80,
      tabWidth: 2,
      ignoreUrls: true,
      ignorePattern: '^goog\.(module|require)',
    }],
    'new-cap': 2, // google
    'no-array-constructor': 2, // google
    'no-mixed-spaces-and-tabs': 2, // eslint:recommended
    'no-multiple-empty-lines': [2, { max: 2 }], // google
    'no-new-object': 2, // google
    'no-trailing-spaces': 2, // google
    'object-curly-spacing': 2, // google
    'one-var': [2, { // google
      var: 'never',
      let: 'never',
      const: 'never',
    }],
    'padded-blocks': [2, 'never'], // google
    'quote-props': [2, 'consistent'], // google
    'quotes': [2, 'single', { allowTemplateLiterals: true }], // google
    'require-jsdoc': [2, { // google
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
      },
    }],
    'semi-spacing': 2, // google
    'semi': 2, // google
    'space-before-blocks': 2, // google
    'space-before-function-paren': [2, 'never'], // google
    'spaced-comment': [2, 'always'], // google

    // ECMAScript 6
    'arrow-parens': [2, 'always'], // google
    'generator-star-spacing': [2, 'after'], // google
    'no-var': 2, // google
    'prefer-rest-params': 2, // google
    'prefer-spread': 2, // google
    'rest-spread-spacing': 2, // google
    'yield-star-spacing': [2, 'after'], // google
  }
};
