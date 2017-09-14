/** @module i18n */

import handlebars from 'handlebars/runtime';
import i18next from 'i18next';
import xhr from 'i18next-xhr-backend';
import lngDetector from 'i18next-browser-languagedetector';

let initPromise;

/**
 * Initialize i18next. Returns a promise.
 * @param  {String}  geonaServer URL of the geona server to download translations from
 * @return {Promise}             A promise that resolves when i18next is ready
 */
export function initI18n(geonaServer) {
  if (!initPromise) {
    // If the promise hasn't been created yet
    initPromise = new Promise((resolve) => {
      i18next
        .use(xhr)
        .use(lngDetector)
        .init({
          debug: false,

          // All namespaces used by the client must be defined here
          ns: ['common', 'intro', 'menu'],

          fallbackLng: 'en',
          defaultNS: 'common',

          backend: {
            loadPath: geonaServer + '/locales/resources.json?lng={{lng}}&ns={{ns}}',
            allowMultiLoading: true,
            crossDomain: true,
          },

          detection: {
            // order and from where user language should be detected
            order: ['cookie'],

            // keys or params to lookup language from
            lookupCookie: 'geona-i18n',

            // cache user language on
            caches: ['cookie'],

            // optional expire and domain for set cookie
            cookieMinutes: 525600, // One year
            // cookieDomain: 'myDomain',
          },
        }, () => {
          // Resolve the promise when i18next is ready
          resolve();
        });
    });
  }

  return initPromise;
}


/*
 * Handlebars helper for i18n translation.
 * Adapted from stackoverflow.com/a/37824273 and github.com/i18next/i18next-node/issues/199#issuecomment-129258127
 *
 * Use in the format:
 *   {{t 'key' interpolationVal=value}}
 */
handlebars.registerHelper('t', function(key, options) {
  let result = i18next.t(key, options.hash);
  return new handlebars.SafeString(result);
});
