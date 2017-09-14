/** @module layer/layer_wms */

import LayerVisible from './layer_visible';

/**
 * Class or a WMS layer.
 */
export default class LayerWms extends LayerVisible {
  /**
   * Instantiate a new LayerWms
   * @param  {Object}      layerConfig The config for the layer
   * @param  {LayerServer} layerServer (optional) The server that provides this layer.
   *                                              Not all layer types require a server
   */
  constructor(layerConfig, layerServer) {
    super(layerConfig, layerServer);
    this.PROTOCOL = 'wms';
    this.name = layerConfig.name;
    this.styles = {};
  }
}
