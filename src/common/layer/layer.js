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
    this.originalIdentifier = layerConfig.identifier;
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
    if (layerConfig.styles) {
      this.styles = layerConfig.styles;

      if (layerConfig.defaultStyle) {
        if (this.stylesContains(layerConfig.defaultStyle)) {
          this.defaultStyle = layerConfig.defaultStyle;
        } else {
          throw new Error('ConfigError - styles list for layer ' + this.identifier + ' does not contain specified defaultStyle ' + layerConfig.defaultStyle);
        }
      }

      if (layerConfig.currentStyle) {
        if (this.stylesContains(layerConfig.currentStyle)) {
          this.currentStyle = layerConfig.currentStyle;
        } else {
          throw new Error('ConfigError - styles list for layer ' + this.identifier + ' does not contain specified currentStyle ' + layerConfig.currentStyle);
        }
      } else if (this.defaultStyle) {
        this.currentStyle = this.defaultStyle;
      }
    }

    this.isTemporal = layerConfig.isTemporal;
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

    if (!this.modifier || this.modifier === 'hasTime') {
      this.aboveMaxColor = undefined;
      this.belowMinColor = undefined;

      this.aboveMaxColorDefault = undefined;
      this.belowMinColorDefault = undefined;
    }

    // this.crs = ['EPSG:4326', 'CRS:84', 'EPSG:41001', 'EPSG:27700', 'EPSG:3408',
    // 'EPSG:3409', 'EPSG:3857', 'EPSG:900913', 'EPSG:32661', 'EPSG:32761'];
  }

  /**
   * Returns either the title, or if set, the display name. Always chooses the display name if it exists.
   * @return {I18nString} The title or display name.
   */
  getTitleOrDisplayName() {
    if (this.displayName) {
      return this.displayName;
    } else {
      return this.title;
    }
  }


  /**
   * Checks that the styles array contains a style with the specified identifier.
   * @param  {String}  style An identifier for the style we are checking for.
   * @return {Boolean}       True if the styles array contains the specified style.
   */
  stylesContains(style) {
    for (let layerStyle of this.styles) {
      if (layerStyle.identifier === style) {
        return true;
      }
    }
    return false;
  }
}

/* Type definitions for this class */
/**
 * Contains one or more Strings, separated into their respective language code. For example, an I18nString might contain
 * a String for the key 'en' (English), another String for the key 'fr' (French) and another String for the key 'und'
 * (undefined language). This is used to present data in different languages for different i18n settings.
 * @typedef {Object} I18nString
 *   @property {String} string A string in the language as specified by the language code key.
 */
