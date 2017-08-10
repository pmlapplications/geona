/* eslint no-invalid-this: 0 */

import hbs from 'hbs';
import {registerHelpers} from '../common/hbs_helpers';

// Register the helpers from common/hbs_helpers
registerHelpers(hbs);

/*
 * Helper for i18n translation.
 * Adapted from stackoverflow.com/a/37824273 and github.com/i18next/i18next-node/issues/199#issuecomment-129258127
 *
 * Use in the format:
 *   {{{t 'key' interpolationVal=value}}}
 */
hbs.registerHelper('t', function(key, options) {
  let result = this.t(key, options.hash);
  return new hbs.SafeString(result);
});
