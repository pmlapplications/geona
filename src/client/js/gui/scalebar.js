/** @module scalebar */

import * as templates from '../../templates/compiled';
import $ from 'jquery';
import moment from 'moment';

/**
 * A class used to instantiate and control a scalebar for a layer.
 *
 * Information about MinMax (used for auto scale):
 * The MINMAX_SEARCH_DENSITY specifies a width/height ratio to use when finding the minmax metadata. To save resources,
 * the operation doesn't search every single value, and instead applies a grid over the data and searches the center
 * point of each grid square. The higher the grid density, the more accurate the scale, but the longer the operation
 * takes to return. The density of 1000 takes about 1 second to return.
 * More information can be found on the NCWMS guide:
 * https://reading-escience-centre.gitbooks.io/ncwms-user-guide/content/04-usage.html#getmetadata
 * and on this GitHub issue:
 * https://github.com/Reading-eScience-Centre/ncwms/issues/29
 */
export class Scalebar {
  /**
   * Sets the variables for the scalebar.
   * @param {MainMenu} mainMenu              The Geona MainMenu instance.
   * @param {Object}   scalebarConfigOptions Config options relating to this scalebar.
   */
  constructor(mainMenu, scalebarConfigOptions) {
    this.geona = mainMenu.geona;
    this.geonaDiv = mainMenu.geonaDiv;
    this.mainMenu = mainMenu;

    /** @desc The item this scalebar belongs to. @type {HTMLElement} */
    this.layersPanelItem = scalebarConfigOptions.layersPanelItem;
    /** @desc The identifier for the layer this scalebar represents. @type {String} */
    this.layerIdentifier = scalebarConfigOptions.layerIdentifier;

    /** @desc CONST - The number of divisions to search when finding the min and max scale values. @type {Number} */
    this.MINMAX_SEARCH_DENSITY = 1000;
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
      // Set the default values for getting a Legend URL
      let url;
      let width;
      let height;
      let rotationAngle;

      // Set the width and height to the layer's specified info, if possible
      if (geonaLayer.scale) {
        width = geonaLayer.scale.width;
        height = geonaLayer.scale.height;
        rotationAngle = geonaLayer.scale.rotationAngle;
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
        rotationAngle: rotationAngle || 0,
        scaleTicks: scaleTicks,
      };
    }
  }

  /**
   * Constructs a URL which is used to get the scalebar image.
   * @param {Layer}   geonaLayer  The Geona Layer we want to get a scalebar for.
   * @param {Object}  [legendUrl] The legendUrl info taken from the current style for this layer.
   * @param {Boolean} [preview]   If True, the image is only a preview, so default values will be used.
   *
   * @return {String}             The URL used to get the scalebar image.
   */
  createGetLegendUrl(geonaLayer, legendUrl, preview = false) {
    // Holds the request types and parameters to be appended on the URL
    let requestParameters = '';

    // Will be used to hold the legendUrl - if preview is True, will have its PALETTE request parameter modified
    let baseUrl = '';
    if (legendUrl && legendUrl.onlineResource && legendUrl.onlineResource.href) {
      baseUrl = legendUrl.onlineResource.href;
    }

    // If the layer has a specific height to use, use that
    if (geonaLayer.scale.height) {
      requestParameters += '&HEIGHT=' + geonaLayer.scale.height;
    } else if (legendUrl && legendUrl.height) { // Otherwise, if the style has a height to use, use that
      requestParameters += '&HEIGHT=' + legendUrl.height;
    }
    // If the layer has a specific width to use, use that
    if (geonaLayer.scale.width) {
      requestParameters += '&WIDTH=' + geonaLayer.scale.width;
    } else if (legendUrl && legendUrl.width) { // Otherwise, if the style has a width to use, use that
      requestParameters += '&WIDTH=' + legendUrl.width;
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
      if (geonaLayer.scale.logarithmicDefault) {
        requestParameters += '&LOGSCALE=' + geonaLayer.scale.logarithmicDefault;
      }
      if (geonaLayer.scale.numColorBands) {
        requestParameters += '&NUMCOLORBANDS=' + geonaLayer.scale.numColorBands;
      }
      if (geonaLayer.scale.aboveMaxColor) {
        requestParameters += '&ABOVEMAXCOLOR=' + geonaLayer.scale.aboveMaxColor;
      }
      if (geonaLayer.scale.belowMinColor) {
        requestParameters += '&BELOWMINCOLOR=' + geonaLayer.scale.belowMinColor;
      }
    }

    // We append a '?' to the baseUrl if it doesn't already exist
    if (baseUrl.indexOf('?') === -1) {
      baseUrl = baseUrl + '?';
    }

    // If we had a legendUrl supplied, we will use that - otherwise we build a new URL
    if (baseUrl.length > 1) {
      return baseUrl + requestParameters;
    } else {
      let serverUrl = this.geona.map.availableLayerServers[geonaLayer.layerServer].url;
      if (serverUrl.indexOf('?') === -1) {
        serverUrl = serverUrl + '?';
      }
      // TODO the identifier here might change - we need to save an originalIdentifier on each layer, which never changes and is used for server requests
      return serverUrl + 'REQUEST=GetLegendGraphic&LAYER=' + geonaLayer.identifier + requestParameters + '&FORMAT=image/png';
    }
  }

  /**
   * Tries to get appropriate min and max scale values for use when automatically setting a linear scale. Uses the NCWMS
   * 'minmax' GetMetadata item. More information on the minmax item can be found at the head of this file.
   * @return {Promise} Will resolve to an Object containing a min and a max value.
   */
  getAutoScale() {
    return new Promise((resolve, reject) => {
      let geonaLayer = this.geona.map.availableLayers[this.layerIdentifier];
      let geonaLayerServer = this.geona.map.availableLayerServers[geonaLayer.layerServer];
      let baseUrl = geonaLayerServer.url;

      // We need the baseUrl to have a '?' before the request parameters
      if (baseUrl.indexOf('?') === -1) {
        baseUrl = baseUrl + '?';
      }

      // Set the bounding box parameter in correct format
      let bbox = geonaLayer.boundingBox.minLon + ','
        + geonaLayer.boundingBox.minLat + ','
        + geonaLayer.boundingBox.maxLon + ','
        + geonaLayer.boundingBox.maxLat;

      // Get the current time if possible
      let time;
      if (geonaLayer.modifier === 'hasTime') {
        time = geonaLayer.dimensions.time.loaded;
      }

      // The minmax operation gets approximate min and max values for the scale at the selected datetime
      let minMaxRequestParameters = 'request=GetMetadata&item=minmax&layers=' + geonaLayer.identifier
        + '&bbox=' + bbox
        + '&elevation=' + (geonaLayer.elevation || -1)
        + '&srs=' + this.geona.map.config.projection
        + '&width=' + this.MINMAX_SEARCH_DENSITY
        + '&height=' + this.MINMAX_SEARCH_DENSITY;

      // Include time if appropriate
      if (time) {
        minMaxRequestParameters += '&time=' + time;
      }

      // Include elevation if appropriate
      if (geonaLayer.currentElevation) {
        minMaxRequestParameters += '&elevation=' + geonaLayer.currentElevation;
      }

      // Make the request for the min and max scale values
      $.ajax(baseUrl + minMaxRequestParameters)
        .done((minMaxJson) => {
          resolve(minMaxJson);
        })
        .fail((err) => {
          reject(err);
        });
    });
  }

  /**
   * Resets the scale to its original values.
   */
  resetScale() { // todo should this be a 'getResetScale' to be then manually used with validateScale()?
    let geonaLayer = this.geona.map.availableLayers[this.layerIdentifier];
    let min = geonaLayer.scale.minDefault;
    let max = geonaLayer.scale.maxDefault;
    let log = geonaLayer.scale.logarithmicDefault;
    this.validateScale(min, max, log);
  }

  /**
   * Verifies that the scale is within allowed bounds, and then updates the scalebar.
   * @param {Number|String} min         The minimum scale value.
   * @param {Number|String} max         The maximum scale value.
   * @param {Boolean}       logarithmic If True, the scale is logarithmic.
   * @param {Boolean}       [instant]   If True, will immediately apply the change instead of asking to confirm changes.
   */
  validateScale(min, max, logarithmic, instant = false) {
    let geonaLayer = this.geona.map.availableLayers[this.layerIdentifier];
    let newMin = parseFloat(min);
    let newMax = parseFloat(max);
    let isLogarithmic = logarithmic;

    // If min or max is invalid throw an error
    if (!newMin && newMin !== 0) {
      let minValError = new Error('Min value ' + newMin + ' is not a valid number.');
      minValError.name = 'MinValueInvalidError';
      throw minValError;
    }
    if (!newMax && newMax !== 0) {
      let maxValError = new Error('Max value ' + newMax + ' is not a valid number.');
      maxValError.name = 'MaxValueInvalidError';
      throw maxValError;
    }
    if (newMin > newMax) {
      let swappedValError = new Error('Min parameter value must be smaller than max parameter value.');
      swappedValError.name = 'SwappedValuesError';
      throw swappedValError;
    }

    // If the scale has actually changed then we will update the scalebar
    if (newMin !== geonaLayer.scale.min || newMax !== geonaLayer.scale.max || isLogarithmic !== geonaLayer.scale.logarithmic) {
      // We'll prevent the user from using a log scale if invalid, but we'll allow the rest of the updates to go ahead
      if (isLogarithmic && newMin <= 0) {
        isLogarithmic = false;
        console.error('Cannot use a logarithmic scale with negative or zero values.');
      }

      // Update the min and max box values
      $(this.layersPanelItem).find('.js-geona-layers-list__item-body-settings__scale-min').val(newMin);
      $(this.layersPanelItem).find('.js-geona-layers-list__item-body-settings__scale-max').val(newMax);
      $(this.layersPanelItem).find('.js-geona-layers-list__item-body-settings__scale-logarithmic').prop('checked', isLogarithmic);

      // Update the layer definition
      geonaLayer.scale.min = newMin;
      geonaLayer.scale.max = newMax;
      geonaLayer.scale.logarithmic = isLogarithmic;

      if (instant) {
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
  updateScalebar() {
    let geonaLayer = this.geona.map.availableLayers[this.layerIdentifier];
    // todo these need to be set at the start as well (in OL and L map libraries)
    let params = {
      colorScaleRange: geonaLayer.scale.min + ',' + geonaLayer.scale.max,
      logScale: geonaLayer.scale.logarithmic,
      numColorBands: geonaLayer.scale.numColorBands,
      style: this.geona.map.layerSourceGet(this.layerIdentifier, 'style'),
      aboveMaxColor: geonaLayer.scale.aboveMaxColor,
      belowMinColor: geonaLayer.scale.belowMinColor,
      elevation: geonaLayer.currentElevation,
    };

    this.geona.map.updateSourceParams(this.layerIdentifier, params);

    this.drawScalebar();
  }

  /**
   * Draws a scalebar based on the current settings. Will replace the currently-displayed scalebar if there is one.
   */
  drawScalebar() {
    let geonaLayer = this.geona.map.availableLayers[this.layerIdentifier];

    let scalebarDetails = this.getScalebarDetails();

    if (scalebarDetails) {
      geonaLayer.scale.currentUrl = scalebarDetails.url;
      geonaLayer.scale.scaleTicks = scalebarDetails.scaleTicks;
      geonaLayer.scale.width = scalebarDetails.width;
      geonaLayer.scale.height = scalebarDetails.height;
      geonaLayer.scale.rotationAngle = scalebarDetails.rotationAngle;
    }

    // The URL we will use to request the scalebar image
    let scalebarUrl = geonaLayer.scale.currentUrl;

    if (geonaLayer.scale.rotationAngle !== 0) {
      let requestUrl = encodeURIComponent(scalebarUrl) + '/' + geonaLayer.scale.rotationAngle;
      scalebarUrl = this.geona.geonaServer + '/utils/rotateImageFromUrl/' + requestUrl;
    }

    // Holds data which will be passed to the scalebar template
    let scalebarData = {
      scalebar: {
        src: scalebarUrl, // The URL that the <img> tag will use as its src
        colorBarOnly: geonaLayer.scale.colorBarOnly,
      },
      scale: {
        identifier: geonaLayer.identifier,
        min: geonaLayer.scale.min,
        max: geonaLayer.scale.max,
        units: geonaLayer.units,
      },
      labels: geonaLayer.scale.scaleTicks,
    };

    let currentLayerTime;
    if (geonaLayer.modifier === 'hasTime') {
      currentLayerTime = geonaLayer.dimensions.time.loaded;
    }
    let formattedDatetime;
    if (currentLayerTime) {
      formattedDatetime = moment(currentLayerTime).format('YYYY-MM-DD HH:mm:ss');
    } else {
      formattedDatetime = 'Invalid Time'; // todo should be i18n-compatible
    }

    // Add the scalebar to this layers panel item
    $(this.layersPanelItem).find('.js-geona-layers-list__item-scalebar')
      .html(templates.scalebar({scalebarData: scalebarData, formattedDatetime: formattedDatetime}));
  }
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

/* Type definitions for this class */

/**
 * @typedef {Object} ScalebarConfigOptions
 *   @property {HTMLElement} layersPanelItem The item which contains this scalebar.
 *   @property {String}      layerIdentifier The identifier for the layer this scalebar represents.
 */

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
