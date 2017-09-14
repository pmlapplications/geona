/** @module map */

/**
 * This file defines the base class and interface for a map.
 */

/* eslint class-methods-use-this: 0 */
/* eslint no-empty-function: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */

/**
 * Base class and interface for a map.
 * @interface
 *
 * @param {Object}      config A map config to initialise the map with.
 * @param {HTMLElement} mapDiv The div to put the map in
 */
export default class GeonaMap {
  /**
   * Set the graticule as visible or not.
   * @param  {Boolean} display True to display graticule
   */
  displayGraticule(display) {}

  /**
   * Set the basemap, changing the projection if required.
   * @param {String} basemap The id of the basemap to use, or 'none'
   */
  setBasemap(basemap) {}

  /**
   * Set the country borders to display.
   * @param {String} borders The borders to display, or 'none'
   */
  setCountryBorders(borders) {}

  /**
   * Set the projection, if supported by the current basemap.
   * @param {String} projection The projection to use, such as 'EPSG:4326'
   */
  setProjection(projection) {}

  /**
   * Add the specified data layer onto the map.
   * @param {String} layerId The id of the data layer being added.
   * @param {Integer} [index] The zero-based index to insert the layer into.
   */
  addLayer(layerId, index) {}

  /**
   * Remove the specified data layer from the map.
   * @param {*} layerId The id of the data layer being removed.
   */
  removeLayer(layerId) {}

  /**
   * Makes an invisible layer visible.
   * @param {*} layerId The id of the data layer being made visible.
   */
  showLayer(layerId) {}

  /**
   * Makes a layer invisible, but keeps it on the map.
   * @param {*} layerId The id of the data layer being made hidden.
   */
  hideLayer(layerId) {}

  /**
   * Set the map view with the provided options. Uses OpenLayers style zoom levels.
   * @param {Object}  options            View options. All are optional
   * @param {Array}   options.center     The centre as [lat, lon]
   * @param {Array}   options.fitExtent  Extent to fit the view to, defined as [minLat, minLon, maxLat, maxLon]
   * @param {Array}   options.maxExtent  Extent to restrict the view to, defined as [minLat, minLon, maxLat, maxLon]
   * @param {Number}  options.maxZoom    The maximum allowed zoom
   * @param {Number}  options.minZoom    The minimum allowed zoom
   * @param {String}  options.projection The projection, such as 'EPSG:4326'
   * @param {Number}  options.zoom       The zoom
   */
  setView(options) {}

  /**
   * Use the config to setup the map view.
   *
   * This should be called at the end of a map constructor.
   * This function should not be overridden.
   */
  loadConfig_() {
    this.setBasemap(this.config.basemap);
    this.setCountryBorders(this.config.countryBorders);
    this.displayGraticule(this.config.graticule);
    this.setProjection(this.config.projection);
    this.setView(this.config.viewSettings);
  }
}

// Fields
/**
 * @type {Object} The config for the map. Also used to hold the current state of the map.
 *                It may be read from outside the class to read/save the map state, but must never be modified by
 *                anything outside the class.
 */
GeonaMap.prototype.config;
