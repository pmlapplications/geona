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

  createGetLegendUrl() {}

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
