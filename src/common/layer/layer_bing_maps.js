import LayerVisible from './layer_visible';

/**
 * Class for a Bing Maps layer
 */
export default class LayerBingMaps extends LayerVisible {
  /**
   * Instantiate a new Layer
   * @param  {Object}      layerConfig The config for the layer
   */
  constructor(layerConfig) {
    super(layerConfig);
    this.PROTOCOL = 'bingMaps';
    this.imagerySet = layerConfig.imagerySet;
  }
}
