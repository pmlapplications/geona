import {Config, getSchema} from './config';
import * as init from './init';

export class Geona {
  constructor(clientConfig) {
    this.config = new Config(clientConfig);

    if (this.config.get('mapLibrary') === 'openlayers') {
      init.initOpenlayers(this.config.getProperties());
    }
  }
}
