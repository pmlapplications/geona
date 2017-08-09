import express from 'express';
import * as http from 'http';
import i18next from 'i18next';
import i18nextBackend from 'i18next-node-fs-backend';
import * as i18nextMiddleware from 'i18next-express-middleware';
import * as path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

import {server as configServer} from './config';
import mainRouter from './routers/main';
import './hbs_helpers';

/*
 * Setup i18next
 */

i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    debug: false,

    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    saveMissing: true,
    preload: ['en', 'fr'],

    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json',
      jsonIndent: 2,
    },

    detection: {
      // order and from where user language should be detected
      order: [/* 'path', 'session', */'querystring', 'cookie', 'header'],

      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'geona-i18n',
      lookupSession: 'geona-i18n',
      // lookupPath: 'lng',
      lookupFromPathIndex: 0,

      // cache user language
      caches: ['cookie'], // ['cookie']

      // optional expire and domain for set cookie
      // cookieExpirationDate: new Date(),
      // cookieDomain: 'myDomain',
    },
  });


/*
 * Setup express and the hbs (handlebars) template engine
 */

let app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/templates');
app.use(i18nextMiddleware.handle(i18next, {}));


/*
 * Setup swagger for api docs
 * TODO: Config option to enable swagger or not
 */

let swaggerDefinition = {
  info: {
    title: process.env.npm_package_name,
    version: process.env.npm_package_version,
    description: process.env.npm_package_description,
  },
};

let swaggerOptions = {
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./src/server/routers/main_router.js'],
};

// initialize swagger-jsdoc
let swaggerSpec = swaggerJSDoc(swaggerOptions);

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


/*
 * Setup routes and routers
 */

// Setup the static path for the static folder
app.use(express.static(path.join(__dirname, '../../static')));

// Add the main router
app.use(mainRouter);


/*
 * Create the server and start it
 */

let server = http.createServer(app);

server.listen(configServer.get('port'), function() {
  console.log('Server running at http://127.0.0.1:' + configServer.get('port'));
});


/*
 * Handle plugins
 * TODO: More advanced plugin loading (API?)
 */

for (let plugin of configServer.get('plugins')) {
  console.log('Loading plugin: ' + plugin);
  import(plugin).then((loadedPlugin) => loadedPlugin());
}


/*
 * Export app for testing
 */

export default app;
