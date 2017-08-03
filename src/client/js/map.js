/* eslint class-methods-use-this: 0 */
/* eslint no-empty-function: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */

/**
 * Interface for a map.
 * @interface
 *
 * @param {Object} config A map config to initialise the map with.
 */
export default class GeonaMap {
  /**
   * Set the graticule as visible or not.
   * @param  {Boolean} display True to display graticule
   */
  displayGraticule(display) {}

  /**
   * Set the basemap.
   * @param {String} basemap The id of the basemap to use, or 'none'
   */
  setBasemap(basemap) {}

  /**
   * Set the country borders to display, or none.
   * @param {String} borders The borders to display, or 'none'
   */
  setCountryBorders(borders) {}

  /**
   * Set the projection.
   * @param {String} projection The projection to use
   */
  setProjection(projection) {}

  /**
   * Set the map view with the provided options
   * @param {Object}  options            View options. All are optional
   * @param {Array}   options.center     The centre as [lat, lon]
   * @param {Array}   options.fitExtent  Extent to fit the view to, defined as [minLat, minLon, maxLat, maxLon]
   * @param {Array}   options.maxExtent  Extent to restrict the view to, defined as [minLat, minLon, maxLat, maxLon]
   * @param {Number}  options.maxZoom    The maximum allowed zoom
   * @param {Number}  options.minZoom    The minimum allowed zoom
   * @param {String}  options.projection The projection
   * @param {Number}  options.zoom       The zoom
   */
  setView(options) {}
}

// Fields
/**
 * @type {Object} The config for the map. Also used to hold the current state of the map.
 *                It may be read from outside the class to read/save the map state, but must never be modified by
 *                anything outside the class.
 */
GeonaMap.prototype.config;
