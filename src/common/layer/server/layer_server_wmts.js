/** @module layer/server/layer_server_wmts */

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
  constructor(serverConfig, identifier) {
    super(serverConfig, identifier);

    // this.identifier = identifier;

    this.operationsMetadata = serverConfig.operationsMetadata;
    this.tileMatrixSets = serverConfig.tileMatrixSets;
  }
}
