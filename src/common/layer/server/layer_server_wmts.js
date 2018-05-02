/** @module layer/server/layer_server_wmts */

import LayerServerOws from './layer_server_ows';

/**
 * Class for a WMTS layer server
 * @extends {LayerServerOws}
 */
export default class LayerServerWmts extends LayerServerOws {
  /**
   * Instantiates a new LayerServerWmts. WMTS layer servers have two additional properties:
   *  - operationsMetadata: Describes the server operations that can be performed (e.g. GetCapabilities).
   *  - tileMatrixSets: Definitions for the tiles that corresponding layers use.
   *
   * @param {Object} serverConfig The server config. See the class diagram.
   * @param {String} identifier   The identifier to use for this layer server.
   */
  constructor(serverConfig, identifier) {
    super(serverConfig, identifier);

    this.operationsMetadata = serverConfig.operationsMetadata;
    this.tileMatrixSets = serverConfig.tileMatrixSets;
  }
}
