/* eslint no-invalid-this: 0 */

import hbs from 'hbs';

/**
 * General logic helpers.
 *
 * Use in the format:
 *    {{#if (or
 *             (eq section1 "foo")
 *             (ne section2 "bar")
 *             (gt numVar 10)
 *          )}}
 *       .. content
 *    {{/if}}
 */
hbs.registerHelper({
  // equal
  eq: function(v1, v2) {
    return v1 === v2;
  },
  // not equal
  ne: function(v1, v2) {
    return v1 !== v2;
  },
  // less than
  lt: function(v1, v2) {
    return v1 < v2;
  },
  // greater than
  gt: function(v1, v2) {
    return v1 > v2;
  },
  // less than or equal
  lte: function(v1, v2) {
    return v1 <= v2;
  },
  // greater than or equal
  gte: function(v1, v2) {
    return v1 >= v2;
  },
  and: function(...args) {
    // // Convert arguments into normal array in safe, optimisable way
    // let args = new Array(arguments.length - 1);
    // for (let i = 0; i < args.length; ++i) {
    //   args[i] = arguments[i];
    // }

    // Test that all arguments are true
    return args.every(Boolean);
  },
  or: function(...args) {
    // // Convert arguments into normal array in safe, optimisable way
    // let args = new Array(arguments.length - 1);
    // for (let i = 0; i < args.length; ++i) {
    //   args[i] = arguments[i];
    // }

    // Test that some arguments are true
    return args.some(Boolean);
  },
});

/**
 * Switch and case helper.
 * Adapted from github.com/wycats/handlebars.js/issues/927#issuecomment-200784792
 *
 * Use in the format:
 *   {{#switch variable}}
 *     {{#case 'value1'}}
 *       // do stuff
 *     {{/case}}
 *     {{#case 'value2' 'value3'}}
 *       // do something else
 *     {{/case}}
 *   {{/switch}}
 */
hbs.registerHelper('switch', function(value, options) {
  this._switch_value_ = value;
  let html = options.fn(this); // Process the body of the switch block
  delete this._switch_value_;
  return html;
});

/**
 * Case for use with switch.
 *
 * Multiple values can be passed to a case and will be used as OR values:
 *   {{#case 'value2' 'value3'}}
 */
hbs.registerHelper('case', function(...args) {
  let options = args.pop();
  let caseValues = args;

  if (caseValues.indexOf(this._switch_value_) === -1) {
    return '';
  } else {
    return options.fn(this);
  }
});
