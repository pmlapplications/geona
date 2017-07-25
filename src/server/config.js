import chalk from 'chalk';
import convict from 'convict';
import * as path from 'path';

import * as schema from '../common/config_schema.js';

export let server = convict(schema.server);

export let clients = convict([schema.client]);


//   server: {
//     port: {
//       doc: 'Port to run server on',
//       format: 'port',
//       default: 6789,
//     },
//     plugins: {
//       doc: 'Server plugins to load',
//       format: 'Array',
//       default: [],
//     },
//   },
//   client: {
//     geonaServer: {
//       doc: 'The URL of the geona server to use',
//       format: 'url',
//       default: '',
//     },
//     mapLibrary: {
//       doc: 'Which map library to use - leaflet or openlayers.',
//       format: ['openlayers', 'leaflet'],
//       default: 'openlayers',
//     },
//   },
// });

server.loadFile(path.join(__dirname, '../../config/config.json'));
try {
  server.validate();
} catch (e) {
  console.error(chalk.red('\nConfig error: ' + e.message + '\n'));
}

clients.loadFile(path.join(__dirname, '../../config/config_clients.json'));
try {
  clients.validate();
} catch (e) {
  console.error(chalk.red('\nConfig error: ' + e.message + '\n'));
}
