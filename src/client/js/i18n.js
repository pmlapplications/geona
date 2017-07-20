import i18next from 'i18next';
import xhr from 'i18next-xhr-backend';
import lngDetector from 'i18next-browser-languagedetector';

i18next
  .use(xhr)
  .use(lngDetector)
  .init({
    debug: false,

    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',

    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      // order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],

      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',

      // cache user language on
      caches: ['cookie'],
      // excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

      // optional expire and domain for set cookie
      // cookieMinutes: 10,
      // cookieDomain: 'myDomain',

      // optional htmlTag with lang attribute, the default is:
      // htmlTag: document.documentElement,
    },
  });
