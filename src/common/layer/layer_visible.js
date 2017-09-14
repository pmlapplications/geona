/** @module layer/layer_visible */

import Layer from './layer';

/**
 * Base class for a visible layer.
 */
export default class LayerVisible extends Layer {
  /**
   * Instantiate a new LayerVisible
   * @param  {Object}      layerConfig The config for the layer
   * @param  {LayerServer} layerServer (optional) The server that provides this layer.
   *                                              Not all layer types require a server
   */
  constructor(layerConfig, layerServer) {
    super(layerConfig, layerServer);
    this.viewSettings = layerConfig.viewSettings;
  }
}
