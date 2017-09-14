/** @module app */

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

    // All languages must be defined here
    preload: ['en', 'fr'],
    // All namespaces must be defined here
    ns: ['common', 'intro', 'menu'],

    fallbackLng: 'en',
    defaultNS: 'common',
    saveMissing: false,

    backend: {
      loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.json'),
      jsonIndent: 2,
    },

    detection: {
      // order and from where user language should be detected
      order: ['cookie', 'header'],

      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'geona-i18n',

      // cache user language
      caches: ['cookie'],

      // optional expire and domain for set cookie
      cookieExpirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // One year
      // cookieDomain: 'myDomain',
    },
  });


/*
 * Setup express, the hbs (handlebars) template engine, and i18next handling and multiload backend route
 */

let app = express();
app.set('view engine', 'hbs');
app.set('views', [__dirname + '/templates', __dirname + '/admin/templates']);

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(i18nextMiddleware.handle(i18next, {}));
app.get('/locales/resources.json', i18nextMiddleware.getResourcesHandler(i18next)); // i18next multiload backend route

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
app.use(express.static(path.join(__dirname, '../../static'), {
  setHeaders: function(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  },
}));

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
