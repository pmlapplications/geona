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
  constructor(serverConfig) {
    super(serverConfig);

    this.operationsMetadata = serverConfig.operationsMetadata;
    this.tileMatrixSets = serverConfig.tileMatrixSets;


    for (let layer of this.layers) {
      // Add the supported projections to each layer from its tileMatrixSetLinks
      for (let tileMatrixSetId in layer.tileMatrixSetLinks) {
        if (layer.tileMatrixSetLinks.hasOwnProperty(tileMatrixSetId)) {
          layer.projections.push(this.tileMatrixSets[tileMatrixSetId].projection);
        }
      }
    }
  }
}
