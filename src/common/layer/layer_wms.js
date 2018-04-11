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
  constructor(layerConfig, layerServer) {
    super(layerConfig, layerServer);
    this.protocol = 'wms';
    // TODO each layer is getting created twice for some reason

    // Basemaps and borders do not have metadata, so we only find it for data layers
    if (!this.modifier || this.modifier === 'hasTime') {
      getMetadata(layerServer.url, this.identifier)
        .then((metadataString) => {
          console.log(this.identifier);
          console.log(JSON.parse(metadataString));
          let metadata = JSON.parse(metadataString);

          this.units = metadata.units;
          this.representationStyles = metadata.supportedStyles;
          this.defaultStyle = 'boxfill/' + metadata.defaultPalette;

          if (metadata.copyright) {
            this.attribution += ' ' + metadata.copyright;
          }

          this.scale = {};
          this.scale.min = metadata.scaleRange[0];
          this.scale.max = metadata.scaleRange[1];
          this.scale.numColorBands = metadata.numColorBands;
          this.scale.logarithmic = metadata.logScaling;

          this.scale.minDefault = metadata.scaleRange[0];
          this.scale.maxDefault = metadata.scaleRange[1];
          this.scale.numColorBandsDefault = metadata.numColorBands;
          this.scale.logarithmicDefault = metadata.logScaling;
        }
        );
    }
  }
}

/**
 * Fetches layers for all supported services.
 * @param  {String} url             URL for service request.
 * @param  {String} layerIdentifier The identifier for the layer to get metadata for.
 *
 * @return {Array}              List of layers found from the request
 */
function getMetadata(url, layerIdentifier) {
  return new Promise((resolve, reject) => {
    // ajax to server getLayerServer
    let requestUrl = encodeURIComponent(url) + '/' + layerIdentifier;
    $.ajax('http://127.0.0.1:7890/utils/wms/getMetadata/' + requestUrl)
      .done((layerServerJson) => {
        resolve(layerServerJson);
      })
      .fail((err) => {
        reject(err);
      });
  });
}

