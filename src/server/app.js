import express from 'express'; // Default import since express() is a function
import * as http from 'http';
import * as path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

import mainRouter from './routers/main_router';
import conf from './config';

let app = express();

// swagger definition
let swaggerDefinition = {
  info: {
    title: 'GP2',
    version: '0.0.1',
    description: '',
  },
};

// options for the swagger docs
let options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./src/server/routers/main_router.js'],
};

// initialize swagger-jsdoc
let swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Setup the static path for the html folder
app.use(express.static(path.join(__dirname, '../../static')));

// Add the main router
app.use(mainRouter);

// Create the server and start listening
let server = http.createServer(app);

server.listen(conf.get('server.port'), function() {
  console.log('Server running at http://127.0.0.1:' + conf.get('server.port'));
});

// console.log(conf.get('server.plugins'));

for (let plugin of conf.get('server.plugins')) {
  import(plugin).then((loadedPlugin) => loadedPlugin());
}

// Export app for testing
export default app;
