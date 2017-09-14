/** @module layer/server/layer_server */
import LayerWms from '../layer_wms';

/**
 * Class for a layer server
 */
export default class LayerServer {
  /**
   * Instantiate a new LayerServer
   * @param  {Object} serverConfig The config to instantiate the server with. See class diagram for possible options
   */
  constructor(serverConfig) {
    this.layers = [];

    this.protocol = serverConfig.protocol;
    this.version = serverConfig.version;
    this.url = serverConfig.url;

    this.service = serverConfig.service;

    this.capability = serverConfig.capability;

    this.tags = serverConfig.tags;

    for (let layer of serverConfig.layers) {
      switch (serverConfig.protocol) {
        case 'wms':
          this.layers.push(new LayerWms(layer, this));
      }
    }

    window.testingWmsLayer = this.layers[0];
    window.testingSerCon = this;
  }
}
