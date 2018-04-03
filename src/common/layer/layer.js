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

    this.identifier = layerConfig.identifier;
    this.title = layerConfig.title;
    this.displayName = undefined;
    this.abstract = layerConfig.abstract;
    this.keywords = layerConfig.keywords;
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

    this.modifier = layerConfig.modifier;

    this.dimensions = layerConfig.dimensions;
    if (this.dimensions && this.dimensions.time) {
      // There is no need to sort if we still have times to generate
      if (!this.dimensions.time.intervals ) {
        this.dimensions.time.values.sort();
      }
      // We set the modifier here, unless it has been specified already
      if (!this.modifier) {
        this.modifier = 'hasTime';
      }
    }

    // this.crs = ['EPSG:4326', 'CRS:84', 'EPSG:41001', 'EPSG:27700', 'EPSG:3408',
    // 'EPSG:3409', 'EPSG:3857', 'EPSG:900913', 'EPSG:32661', 'EPSG:32761'];
  }

  /**
   * Returns either the title, or if set, the display name.
   * @return {Object} The title or display name.
   */
  getTitleOrDisplayName() {
    // Always chooses the display name if it exists
    if (this.displayName) {
      return this.displayName;
    } else {
      return this.title;
    }
  }
}
