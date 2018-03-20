/** @module layer/layer */

/**
 * Base class for a layer. This is the base class for all layer types and shouldn't be instantiated directly.
 */
export default class Layer {
  /**
   * Instantiate a new Layer
   * @param  {Object}      layerConfig   The config for the layer
   * @param  {LayerServer} [layerServer] The server that provides this layer. Not all layer types require a server
   */
  constructor(layerConfig, layerServer) {
    this.protocol = null;
    if (layerServer !== undefined) {
      this.layerServer = layerServer.identifier;
    }

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
    if (this.dimensions && this.dimensions.time) {
      // There is no need to sort if we still have times to generate
      if (!this.dimensions.time.intervals ) {
        this.dimensions.time.values.sort();
      }
    }

    // this.crs = ['EPSG:4326', 'CRS:84', 'EPSG:41001', 'EPSG:27700', 'EPSG:3408',
    // 'EPSG:3409', 'EPSG:3857', 'EPSG:900913', 'EPSG:32661', 'EPSG:32761'];
  }
}
