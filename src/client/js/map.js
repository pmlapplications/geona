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
   * Set the basemap.
   * @param {String} basemap The basemap to use, or 'none'
   */
  setBasemap(basemap) {}

  /**
   * Set the projection.
   * @param {String} projection The projection to use
   */
  setProjection(projection) {}

  /**
   * Set the country borders to display, or none.
   * @param {String} borders The borders to display, or 'none'
   */
  setCountryBorders(borders) {}

  /**
   * Set the graticles as visible or not.
   * @param  {Boolean} display True to display graticles
   */
  displayGraticules(display) {}

  /**
   * Set the map view with the provided options
   * @param {Array}  centre     [lat,lon] array
   * @param {Number} zoom       (optional) The  zoom level to use
   * @param {Array}  extent     (optional) [min lat, min lon, max lat, max lon] array to set the maximum extents
   *                            of the map
   * @param {String} projection (optional) The projection to use
   */
  setView(centre, zoom = undefined, extent = undefined, projection = undefined) {}
}

// Fields
/** @type {Object} The config for the map. Also used to hold the current state of the map. */
GeonaMap.prototype.config;
