/** @module layer/layer_osm */

import LayerVisible from './layer_visible';

/**
 * Class for an Open Street Map layer
 */
export default class LayerOsm extends LayerVisible {
  /**
   * Instantiate a new LayerOsm
   * @param  {Object}      layerConfig The config for the layer
   */
  constructor(layerConfig) {
    super(layerConfig);
    this.PROTOCOL = 'osm';
  }
}
