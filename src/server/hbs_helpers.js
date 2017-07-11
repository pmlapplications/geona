/* eslint no-invalid-this: 0 */

import hbs from 'hbs';

// Switch and case based of https://github.com/wycats/handlebars.js/issues/927#issuecomment-200784792

hbs.registerHelper('switch', function(value, options) {
  this._switch_value_ = value;
  let html = options.fn(this); // Process the body of the switch block
  delete this._switch_value_;
  return html;
});

hbs.registerHelper('case', function(...args) {
    // Convert "arguments" to a real array - stackoverflow.com/a/4775938
  // let args = Array.prototype.slice.call(arguments);

  let options = args.pop();
  let caseValues = args;

  if (caseValues.indexOf(this._switch_value_) === -1) {
    return '';
  } else {
    return options.fn(this);
  }
});
