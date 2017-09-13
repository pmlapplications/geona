import LayerServerOws from './layer_server_ows';

/**
 * Class for a WMTS layer server
 * @extends {LayerServerOws}
 */
export default class LayerServerWmts extends LayerServerOws {
  /**
   * Instantiate a new LayerServerWmts
   * @param  {Object} serverConfig The server config. See the class diagram.
   */
  constructor(serverConfig) {
    super(serverConfig);

    this.tileMatrixSets = serverConfig.tileMatrixSets;
  }
}
