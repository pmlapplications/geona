import Config from './config';
import * as ol from './map_openlayers';
import * as leaflet from './map_leaflet';

export class Geona {
  constructor(clientConfig) {
    this.config = new Config(clientConfig);

    switch (this.config.get('map.library')) {
      case 'openlayers':
        this.map = ol;
        break;
      case 'leaflet':
        this.map = leaflet;
        break;
    }

    this.map.init(() => {
      this.map = new this.map.GMap(this.config.get('map'));
      this.map.createMap();
    });
  }
}
