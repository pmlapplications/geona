/** @module layer/layer_wmts */

import LayerVisible from './layer_visible';

/**
 * Class for a WMTS layer.
 */
export default class LayerWmts extends LayerVisible {
  /**
   * Instantiate a new LayerWmts
   * @param  {Object}      layerConfig The config for the layer
   * @param  {LayerServer} layerServer (optional) The server that provides this layer.
   *                                              Not all layer types require a server
   */
  constructor(layerConfig, layerServer) {
    super(layerConfig, layerServer);
    this.protocol = 'wmts';
    this.formats = layerConfig.formats;
    this.resourceUrls = layerConfig.resourceUrls;
    this.tileMatrixSetLinks = layerConfig.tileMatrixSetLinks;

    // Add the supported projections to each layer from its tileMatrixSetLinks
    for (let tileMatrixSetId of this.tileMatrixSetLinks) {
      this.projections.push(layerServer.tileMatrixSets[tileMatrixSetId.tileMatrixSet].projection);
    }
  }
}
