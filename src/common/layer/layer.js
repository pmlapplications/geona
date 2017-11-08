/** @module layer/layer */

/**
 * Base class for a layer. This is the base class for all layer types and shouldn't be instantiated directly.
 */
export default class Layer {
  /**
   * Instantiate a new Layer
   * @param  {Object}      layerConfig The config for the layer
   * @param  {LayerServer} layerServer (optional) The server that provides this layer.
   *                                              Not all layer types require a server
   */
  constructor(layerConfig, layerServer) {
    this.protocol = null;

    this.layerServer = layerServer;

    this.title = layerConfig.title;
    this.abstract = layerConfig.abstract;
    this.keywords = layerConfig.keywords;
    this.contactInformation = layerConfig.contactInformation;
    this.provider = layerConfig.provider;
    this.attribution = layerConfig.attribution;
    this.authority = layerConfig.authority;
    this.tags = layerConfig.tags;

    this.boundingBox = layerConfig.boundingBox;
    this.projections = layerConfig.projections || [];
    this.styles = layerConfig.styles;

    this.isTemporal = layerConfig.isTemporal;
    this.firstTime = layerConfig.firstTime;
    this.lastTime = layerConfig.lastTime;

    this.dimensions = layerConfig.dimensions;

    // TODO: This is probably a bit not obvious and potentially confusing
    // if (this.layerServer) {
    //   this.layerServer.layers.push(this);
    // }

    // this.crs = ['EPSG:4326', 'CRS:84', 'EPSG:41001', 'EPSG:27700', 'EPSG:3408',
    // 'EPSG:3409', 'EPSG:3857', 'EPSG:900913', 'EPSG:32661', 'EPSG:32761'];
  }
}
