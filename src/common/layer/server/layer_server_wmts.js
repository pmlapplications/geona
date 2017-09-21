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
    console.log('layer_server_wmts');
    console.log(this.tileMatrixSets);
    console.log(this.layers);

    for (let layer of this.layers) {
      // Add the supported projections to each layer from its tileMatrixSetLinks
      for (let tileMatrixSetId of layer.tileMatrixSetLinks) {
        console.log(this.tileMatrixSets[tileMatrixSetId.tileMatrixSet].projection);
        layer.projections.push(this.tileMatrixSets[tileMatrixSetId.tileMatrixSet].projection);
      }
    }
  }
}
