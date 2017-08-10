import handlebars from 'handlebars/runtime';
import i18next from 'i18next';
import xhr from 'i18next-xhr-backend';
import lngDetector from 'i18next-browser-languagedetector';

let initPromise = new Promise((resolve) => {
  i18next
    .use(xhr)
    .use(lngDetector)
    .init({
      debug: false,

      // All namespaces used by the client must be added here
      ns: ['common', 'intro'],

      fallbackLng: 'en',
      defaultNS: 'common',

      backend: {
        loadPath: 'locales/resources.json?lng={{lng}}&ns={{ns}}',
        allowMultiLoading: true,
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
    }, (err) => {
      if (err) {
        console.warn('i18n: ' + JSON.stringify(err));
      }
      resolve();
    });
});

export function initI18n() {
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

// TODO for testing only
window.i18n = i18next;
