/** @module layer/layer_wms */

import LayerVisible from './layer_visible';
import $ from 'jquery';

/**
 * Class for a WMS layer.
 */
export default class LayerWms extends LayerVisible {
  /**
   * Instantiate a new LayerWms
   * @param  {Object}      layerConfig   The config for the layer
   * @param  {LayerServer} [layerServer] The server that provides this layer. Not all layer types require a server
   */
  constructor(geonaServer, layerConfig, layerServer) {
    super(layerConfig, layerServer);
    this.protocol = 'wms';
    this.scale = {};

    if (layerConfig.scale) {
      this.scale.width = layerConfig.scale.width;
      this.scale.height = layerConfig.scale.height;
      this.scale.rotationAngle = layerConfig.scale.rotationAngle;
      this.scale.colorBarOnly = layerConfig.scale.colorBarOnly;
      this.scale.min = layerConfig.scale.min;
      this.scale.max = layerConfig.scale.max;
      this.scale.numColorBands = layerConfig.scale.numColorBands;
      this.scale.logarithmic = layerConfig.scale.logarithmic;
      this.scale.minDefault = layerConfig.scale.minDefault;
      this.scale.maxDefault = layerConfig.scale.maxDefault;
      this.scale.numColorBandsDefault = layerConfig.scale.numColorBandsDefault;
      this.scale.logarithmicDefault = layerConfig.scale.logarithmicDefault;
      this.scale.rotationAngle = layerConfig.scale.rotationAngle;
    }

    // Basemaps and borders do not have metadata, so we only find it for data layers
    if (!this.modifier || this.modifier === 'hasTime') {
      getMetadata(geonaServer, layerServer.url, this.identifier)
        .then((metadataString) => {
          let metadata = JSON.parse(metadataString);

          if (!this.units) {
            this.units = metadata.units;
          }
          if (!this.representationStyles) {
            this.representationStyles = metadata.supportedStyles;
          }
          if (!this.defaultStyle) { // fixme the default style should check that the layer.styles actually exists
            this.defaultStyle = 'boxfill/' + metadata.defaultPalette;
          }
          if (metadata.copyright) {
            this.attribution += ' ' + metadata.copyright;
          }

          if (!this.scale.min) {
            this.scale.min = metadata.scaleRange[0];
          }
          if (!this.scale.max) {
            this.scale.max = metadata.scaleRange[1];
          }
          if (!this.scale.numColorBands) {
            this.scale.numColorBands = metadata.numColorBands;
          }
          if (!this.scale.logarithmic) {
            this.scale.logarithmic = metadata.logScaling;
          }
          if (!this.scale.minDefault) {
            this.scale.minDefault = metadata.scaleRange[0];
          }
          if (!this.scale.maxDefault) {
            this.scale.maxDefault = metadata.scaleRange[1];
          }
          if (!this.scale.numColorBandsDefault) {
            this.scale.numColorBandsDefault = metadata.numColorBands;
          }
          if (!this.scale.logarithmicDefault) {
            this.scale.logarithmicDefault = metadata.logScaling;
          }
          if (!this.scale.colorBarOnly) {
            this.scale.colorBarOnly = false;
          }
          if (!this.scale.rotationAngle) {
            this.scale.rotationAngle = 0;
          }
        }
        );
    }
  }
}

/**
 * Fetches layers for all supported services.
 * @param  {String} url             URL for service request.
 * @param  {String} layerIdentifier The identifier of the layer to get metadata for.
 *
 * @return {Array}                  List of layers found from the request
 */
function getMetadata(geonaServer, url, layerIdentifier) { // FIXME doesn't work server-side
  return new Promise((resolve, reject) => {
    // ajax to server getMetadata
    let requestUrl = encodeURIComponent(url) + '/' + layerIdentifier;
    console.log('about to ajax');
    $.ajax(geonaServer + '/utils/wms/getMetadata/' + requestUrl)
      .done((metadataJson) => {
        resolve(metadataJson);
      })
      .fail((err) => {
        reject(err);
      });
  });
}

