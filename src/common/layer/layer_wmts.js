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
    this.name = layerConfig.wmts.name;
    this.styles = {};
    this.styleMatrixSets = layerConfig.styleMatrixSets;
  }
}
