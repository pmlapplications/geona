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
   * @typedef {Object} scalebarDetails
   *   @property {String}   url        writeme.
   *   @property {Number}   width      writeme.
   *   @property {Number}   height     writeme.
   *   @property {Number[]} scaleTicks writeme.
   *
   * @return {scalebarDetails} The information needed to draw a scalebar.
   */
  getScalebarDetails() {
    let geonaLayer = this.geona.map.availableLayers[this.layerIdentifier];
    let activeStyle = this.geona.map.layerSourceGet(this.layerIdentifier, 'style');

    if (geonaLayer) {
      let url;
      let width = 1;
      let height = 500;

      if (geonaLayer.styles) {
        for (let style of geonaLayer.styles) {
          if (style.identifier === activeStyle) {
            if (style.legendUrl) {
              if (style.legendUrl.onlineResource && style.legendUrl.onlineResource.href) {
                url = this.createGetLegendUrl(geonaLayer, style.legendUrl.onlineResource.href);
              }
              width = parseInt(style.legendUrl.width, 10);
              height = parseInt(style.legendUrl.height, 10);
            }
          }
        }
        url = this.createGetLegendUrl(geonaLayer);
      }
    }

    return {};
  }

  createGetLegendUrl() {}

  getAutoScale() {}

  resetScale() {}

  validateScale() {}

  updateScalebar() {}

  drawScalebar() {}
}
