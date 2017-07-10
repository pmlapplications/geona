import chalk from 'chalk';
import convict from 'convict';
import * as path from 'path';

let conf = convict({
  server: {
    port: {
      doc: 'Port to run server on',
      format: 'port',
      default: 1337,
    },
    plugins: {
      doc: 'Server plugins to load',
      format: 'Array',
      default: [],
    },
  },
});

conf.loadFile(path.join(__dirname, '../../config/config.json'));
try {
  conf.validate();
} catch (e) {
  console.error(chalk.red('\nConfig error: ' + e.message + '\n'));
}

export default conf;
