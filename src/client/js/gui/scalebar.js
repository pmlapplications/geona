import $ from 'jquery';

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
    this.mainMenu = mainMenu;

    this.layersPanelItem = scalebarConfigOptions.layersPanelItem;
    this.layerIdentifier = scalebarConfigOptions.layerIdentifier;
  }

  /**
   * Constructs and returns an Object containing the info needed to draw the scalebar.
   * @return {ScalebarDetails} The information needed to draw a scalebar.
   */
  getScalebarDetails() {
    let geonaLayer = this.geona.map._availableLayers[this.layerIdentifier];
    let activeStyle = this.geona.map.layerSourceGet(this.layerIdentifier, 'style');

    if (!geonaLayer) {
      throw new Error('Layer with identifier ' + this.layerIdentifier + ' is not available on the map.');
    } else {
      // Set the default values for getting a Legend URL
      let url;
      let width;
      let height;

      // Set the width and height to the layer's specified info, if possible
      if (geonaLayer.scale) {
        width = geonaLayer.scale.width;
        height = geonaLayer.scale.height;
      }

      // The style should contain a legendUrl, width and height, so we try to find these for the currently active style.
      if (geonaLayer.styles) {
        for (let style of geonaLayer.styles) {
          if (style.identifier === activeStyle) {
            if (style.legendUrl) {
              // We take the information that's available
              if (!width) {
                width = parseInt(style.legendUrl[0].width, 10); // TODO why would there be multiple legendUrls? Add logic if appropriate
              }
              if (!height) {
                height = parseInt(style.legendUrl[0].height, 10);
              }
              url = this.createGetLegendUrl(geonaLayer, style.legendUrl[0]);
            }
          }
        }
      }
      // If we couldn't find a legendUrl, we'll construct one ourselves
      if (url === undefined) {
        url = this.createGetLegendUrl(geonaLayer);
      }

      // Update the GUI boxes with the new min and max values.
      this.mainMenu.setScalebarInputs(geonaLayer.scale.min, geonaLayer.scale.max, this.layersPanelItem);

      // Will hold the axis ticks for the scalebar
      let scaleTicks = [];

      // Create the axis ticks
      if (geonaLayer.scale.logarithmic) {
        // Get the range of the scale
        let max = Math.log(parseFloat(geonaLayer.scale.max, 10));
        let min = Math.log(parseFloat(geonaLayer.scale.min, 10));
        let range = max - min;

        // Generate 5 ticks for the scalebar
        for (let i = 0; i < 5; i++) {
          let step = (range / 4) * i;
          let value = min + step;
          value = Math.exp(value);

          let tick = {
            real: value,
            standardForm: convertToStandardForm(value),
          };

          scaleTicks.push(tick);
        }
      } else {
        // Get the range of the scale
        let max = parseFloat(geonaLayer.scale.max, 10);
        let min = parseFloat(geonaLayer.scale.min, 10);
        let range = max - min;

        // Generate 5 ticks for the scalebar
        for (let i = 0; i < 5; i++) {
          let step = (range / 4) * i;
          let value = min + step;

          let tick = {
            real: value,
            standardForm: convertToStandardForm(value),
          };

          scaleTicks.push(tick);
        }
      }

      return {
        url: url,
        width: width || 1,
        height: height || 500,
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
  createGetLegendUrl(geonaLayer, legendUrl, preview = false) { // todo untested
    // Holds the request types and parameters to be appended on the URL
    let requestParameters = '';
    // Will be used to hold the legendUrl - if preview is True, will have its PALETTE request parameter modified
    let baseUrl = legendUrl || '';

    if (geonaLayer.scale.height) {
      requestParameters += '&HEIGHT=' + geonaLayer.scale.height;
    }
    if (geonaLayer.scale.width) {
      requestParameters += '&WIDTH=' + geonaLayer.scale.width;
    }
    if (geonaLayer.scale.colorBarOnly) {
      requestParameters += '&COLORBARONLY=' + geonaLayer.scale.colorBarOnly;
    }

    // The preview scalebar will only use default values
    if (preview) {
      if (geonaLayer.scale.minDefault && geonaLayer.scale.maxDefault) {
        requestParameters += '&COLORSCALERANGE=' + geonaLayer.scale.minDefault + ',' + geonaLayer.scale.maxDefault;
      }
      if (geonaLayer.defaultStyle) {
        // Removes the PALETTE parameter and value
        baseUrl = baseUrl.replace(/&PALETTE=.+/g, '');
        // Replaces the PALETTE parameter with the palette half of the style (e.g. the 'alg' part of 'boxfill/alg')
        requestParameters += '&PALETTE=' + geonaLayer.defaultStyle.replace(/.+?(?=\/)\//g, '');
      }
      if (geonaLayer.scale.numColorBandsDefault) {
        requestParameters += '&NUMCOLORBANDS=' + geonaLayer.scale.numColorBandsDefault;
      }
      if (geonaLayer.scale.aboveMaxColorDefault) {
        requestParameters += '&ABOVEMAXCOLOR=' + geonaLayer.scale.aboveMaxColorDefault;
      }
      if (geonaLayer.scale.belowMinColorDefault) {
        requestParameters += '&BELOWMINCOLOR=' + geonaLayer.scale.belowMinColorDefault;
      }
    } else {
      if (geonaLayer.scale.min && geonaLayer.scale.max) {
        requestParameters += '&COLORSCALERANGE=' + geonaLayer.scale.min + ',' + geonaLayer.scale.max;
      }
      if (geonaLayer.defaultLog) {
        requestParameters += '&LOGSCALE=' + geonaLayer.scale.defaultLogarithmic;
      }
      if (geonaLayer.colorBands) {
        requestParameters += '&NUMCOLORBANDS=' + geonaLayer.scale.numColorBands;
      }
      if (geonaLayer.scale.aboveMaxColor) {
        requestParameters += '&ABOVEMAXCOLOR=' + geonaLayer.scale.aboveMaxColor;
      }
      if (geonaLayer.scale.belowMinColor) {
        requestParameters += '&BELOWMINCOLOR=' + geonaLayer.scale.belowMinColor;
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

  /**
   * Resets the scale to its original values.
   */
  resetScale() { // todo untested
    let geonaLayer = this.geona.map._availableLayers[this.layerIdentifier];
    let min = geonaLayer.scale.minDefault;
    let max = geonaLayer.scale.maxDefault;
    this.validateScale(min, max);
  }

  /**
   * Verifies that the scale is within allowed bounds, and then updates the scalebar.
   * @param {Number|String} min     The minimum scale value.
   * @param {Number|String} max     The maximum scale value.
   * @param {Boolean}       [force] If True, will immediately apply the change instead of asking to confirm changes.
   */
  validateScale(min, max, force = false) { // todo untested
    let geonaLayer = this.geona.map.availableLayers[this.layerIdentifier];
    let newMin = parseFloat(min);
    let newMax = parseFloat(max);

    // If min or max is invalid throw an error
    if (!min && min !== 0) {
      throw new Error('Min value ' + min + ' is not a valid number.');
    }
    if (!max && max !== 0) {
      throw new Error('Max value ' + max + ' is not a valid number.');
    }
    if (newMin > newMax) {
      throw new Error('Min parameter value must be smaller than max parameter value.');
    }

    let logarithmicCheckbox = $(this.layersPanelItem).find('.js-geona-layers-list__item-body-settings__scale-logarithmic');
    let isLogarithmic = $(logarithmicCheckbox).is(':checked');

    // If the scale has actually changed then we will update the scalebar
    if (newMin !== geonaLayer.scale.min || newMax !== geonaLayer.scale.max || isLogarithmic !== geonaLayer.scale.logarithmic) {
      // We'll prevent the user from using a log scale if invalid, but we'll allow the rest of the updates to go ahead
      if (isLogarithmic && newMin <= 0) {
        alert('Cannot use a logarithmic scale with negative or zero values.');
        logarithmicCheckbox.checked = false;
        isLogarithmic = false;
      }

      // Update the min and max box values
      $(this.layersPanelItem).find('.js-geona-layers-list__item-body-settings__scale-min').val(newMin);
      $(this.layersPanelItem).find('.js-geona-layers-list__item-body-settings__scale-max').val(newMax);

      // Update the layer definition
      geonaLayer.scale.min = newMin;
      geonaLayer.scale.max = newMax;
      geonaLayer.scale.logarithmic = isLogarithmic;

      if (force) {
        this.updateScalebar();
      } else {
        this.mainMenu.addToChangesBuffer(this.layerIdentifier, this.updateScalebar, this);
      }
    }
  }

  /**
   * Constructs a new object containing layer params, and updates the map layer with the params, then calls for the
   * scalebar to be redrawn.
   */
  updateScalebar() { // todo untested
    let geonaLayer = this.geona.map.availableLayers[this.layerIdentifier];

    let params = {
      colorScaleRange: geonaLayer.scale.min + ',' + geonaLayer.scale.max,
      logScale: geonaLayer.scale.logarithmic,
      numColorBands: geonaLayer.scale.numColorBands,
      style: this.geona.map.layerSourceGet(this.identifier, 'style'),
      aboveMaxColor: geonaLayer.scale.aboveMaxColor,
      belowMinColor: geonaLayer.scale.belowMinColor,
      elevation: geonaLayer.currentElevation,
    };

    this.geona.map.updateSourceParams(this.identifier, params);

    this.drawScalebar();
  }

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
