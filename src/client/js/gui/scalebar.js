/* Type definitions for this class */
/**
 * A ScalebarDetails object contains all the information needed to make a call for a new scalebar.
 * @typedef {Object} ScalebarDetails
 *   @property {String} url        A GetLegend URL for this layer.
 *   @property {Number} width      The desired width of the scalebar (vertically-orientated).
 *   @property {Number} height     The desired height of the scalebar (vertically-orientated).
 *   @property {Tick[]} scaleTicks The real and standardised values for the ticks along the bar.
 */
/**
 * A Tick is a representation of a scalebar axis tick. It contains the real and display (standard form) values for the
 * tick (e.g. real: 0.005, standardForm: '5.00e-3').
 * @typedef {Object} Tick
 *   @property {Number} real         The number in decimal form.
 *   @property {String} standardForm The number converted to standard form.
 */


/**
 * A class used to instantiate and control a scalebar for a layer.
 */
export class Scalebar {
  /**
   * Sets the variables for the scalebar.
   * @param {MainMenu} mainMenu              The Geona MainMenu instance.
   * @param {Object}   scalebarConfigOptions Config options relating to this scalebar.
   */
  constructor(mainMenu, scalebarConfigOptions) {
    this.geona = mainMenu.geona;
    this.parentDiv = mainMenu.parentDiv;
    this.layersPanelItem = scalebarConfigOptions.layersPanelItem;
    this.layerIdentifier = scalebarConfigOptions.layerIdentifier;
  }

  /**
   * Constructs and returns an Object containing the info needed to draw the scalebar.
   * @return {ScalebarDetails} The information needed to draw a scalebar.
   */
  getScalebarDetails() {
    let geonaLayer = this.geona.map.availableLayers[this.layerIdentifier];
    let activeStyle = this.geona.map.layerSourceGet(this.layerIdentifier, 'style');

    if (!geonaLayer) {
      throw new Error('Layer with identifier ' + this.layerIdentifier + ' is not available on the map.');
    } else {
      // Set the defualt values for getting a Legend URL
      let url;
      let width = 1;
      let height = 500;

      // The style should contain a legendUrl, width and height, so we try to find these for the currently active style.
      if (geonaLayer.styles) {
        for (let style of geonaLayer.styles) {
          if (style.identifier === activeStyle) {
            if (style.legendUrl) {
              // We take the information that's available
              if (style.legendUrl.onlineResource && style.legendUrl.onlineResource.href) {
                url = this.createGetLegendUrl(geonaLayer, style.legendUrl.onlineResource.href);
              }
              width = parseInt(style.legendUrl.width, 10);
              height = parseInt(style.legendUrl.height, 10);
            }
          }
        }
      }
      // If we couldn't find a legendUrl, we'll construct one ourselves
      if (url === undefined) {
        url = this.createGetLegendUrl(geonaLayer);
      }

      // Update the GUI boxes with the new min and max values.
      this.mainMenu.setScalebarInputs(geonaLayer.scaleMin, geonaLayer.scaleMax, this.layersPanelItem);

      // Will hold the axis ticks for the scalebar
      let scaleTicks = [];

      // Create the axis ticks
      if (geonaLayer.logarithmic) {
        // Get the range of the scale
        let range = Math.log(geonaLayer.scaleMax) - Math.log(geonaLayer.scaleMin);

        // Generate 5 ticks for the scalebar
        let logScaleMin = Math.log(geonaLayer.scaleMin);
        for (let i = 0; i < 5; i++) {
          let step = (range / 4) * i;
          let value = logScaleMin + step;
          value = Math.exp(value);

          let tick = {
            real: value,
            standardForm: convertToStandardForm(value),
          };

          scaleTicks.push(tick);
        }
      } else {
        // Get the range of the scale
        let range = geonaLayer.scaleMax - geonaLayer.scaleMin;

        // Generate 5 ticks for the scalebar
        for (let i = 0; i < 5; i++) {
          let step = (range / 4) * i;
          let value = geonaLayer.scaleMin + step;

          let tick = {
            real: value,
            standardForm: convertToStandardForm(value),
          };

          scaleTicks.push(tick);
        }
      }

      return {
        url: url,
        width: width,
        height: height,
        scaleTicks: scaleTicks,
      };
    }
  }

  /**
   * Constructs a URL which is used to get the scalebar image.
   * @param {Layer}   geonaLayer  The Geona Layer we want to get a scalebar for.
   * @param {String}  [legendUrl] The legendUrl taken from the current style for this layer.
   * @param {Boolean} [preview]   If True, the image is only a preview, so default values will be used.
   *
   * @return {String}             The URL used to get the scalebar image.
   */
  createGetLegendUrl(geonaLayer, legendUrl, preview = false) {
    // Holds the request types and parameters to be appended on the URL
    let requestParameters = '';
    // Will be used to hold the legendUrl - if preview is True, will have its PALETTE request parameter modified
    let baseUrl = legendUrl || '';

    if (geonaLayer.legendSettings.parameters) {
      let legendParameters = geonaLayer.legendSettings.parameters;
      if (legendParameters.height) {
        requestParameters += '&HEIGHT=' + legendParameters.height; // todo why do we get these if they are in the details anyway?
      }
      if (legendParameters.width) {
        requestParameters += '&WIDTH=' + legendParameters.width;
      }
      if (legendParameters.colorBarOnly) {
        requestParameters += '&COLORBARONLY=' + legendParameters.colorBarOnly;
      }
    }

    // The preview scalebar will only use default values
    if (preview) {
      if (geonaLayer.scaleMinDefault && geonaLayer.scaleMaxDefault) {
        requestParameters += '&COLORSCALERANGE=' + geonaLayer.scaleMinDefault + ',' + geonaLayer.scaleMaxDefault;
      }
      if (geonaLayer.defaultStyle) {
        baseUrl = baseUrl.replace(/&PALETTE=.+/g, '');
        requestParameters += '&PALETTE=' + geonaLayer.defaultStyle.replace(/.+?(?=\/)\//g, '');
      }
      if (geonaLayer.defaultColorBands) {
        requestParameters += '&NUMCOLORBANDS=' + geonaLayer.defaultColorbands;
      }
      if (geonaLayer.defaultAboveMaxColor) {
        requestParameters += '&ABOVEMAXCOLOR=' + geonaLayer.defaultAboveMaxColor;
      }
      if (geonaLayer.defaultBelowMinColor) {
        requestParameters += '&BELOWMINCOLOR=' + geonaLayer.defaultBelowMinColor;
      }
    } else {
      if (geonaLayer.scaleMin && geonaLayer.scaleMax) {
        requestParameters += '&COLORSCALERANGE=' + geonaLayer.scaleMin + ',' + geonaLayer.scaleMax;
      }
      if (geonaLayer.defaultLog) {
        requestParameters += '&LOGSCALE=' + geonaLayer.defaultLogarithmic;
      }
      if (geonaLayer.colorBands) {
        requestParameters += '&NUMCOLORBANDS=' + geonaLayer.colorBands;
      }
      if (geonaLayer.AboveMaxColor) {
        requestParameters += '&ABOVEMAXCOLOR=' + geonaLayer.aboveMaxColor;
      }
      if (geonaLayer.BelowMinColor) {
        requestParameters += '&BELOWMINCOLOR=' + geonaLayer.belowMinColor;
      }
    }

    // We prepend a '?' to the requestParameters if it doesn't already exist
    if (requestParameters.length > 0 && baseUrl.indexOf('?') === -1) {
      requestParameters = '?' + requestParameters;
    }

    // If we had a legendUrl supplied, we will use that - otherwise we build a new URL
    if (baseUrl.length > 0) {
      return baseUrl + requestParameters;
    } else {
      let serverUrl = this.geona.map._availableLayerServers[geonaLayer.layerServer].url;
      // TODO the identifier here might change - we need to save an originalIdentifier on each layer, which never changes and is used for server requests
      return serverUrl + 'REQUEST=GetLegendGraphic&LAYER=' + geonaLayer.identifier + requestParameters + '&FORMAT=image/png';
    }
  }

  getAutoScale() {}

  resetScale() {}

  validateScale() {}

  updateScalebar() {}

  drawScalebar() {}
}

/**
 * Converts a full number into the standard form of that number.
 * For example, '0.005' would be converted to '5.00e-3'.
 * @param  {Number|String} number The full number to convert into standard form.
 * @return {String}               A number in standard form.
 */
function convertToStandardForm(number) {
  let string = number.toString();
  let exponential = parseFloat(number).toExponential(2);
  if (exponential) {
    return exponential;
  } else {
    return string;
  }
}
