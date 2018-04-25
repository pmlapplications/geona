/** @module map */

/**
 * This file defines the base class and interface for a map.
 */

/* eslint class-methods-use-this: 0 */
/* eslint no-empty-function: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* eslint valid-jsdoc: 0 */ // Used to prevent @return tags from erroring

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
  displayGraticule(display) { }

  /**
   * Clears the basemap ready for a new one, changing the projection if required.
   * @param {ol.layer.Tile|L.tileLayer.wms} [layer] Optional layer created in addLayer(),
   *                                                used for setting a new projection
   */
  _clearBasemap(layer) { }

  /**
   * Clear the country borders if active
   */
  _clearBorders() { }

  /**
   * Set the projection, if supported by the current basemap.
   * @param {String} projection The projection to use, such as 'EPSG:4326'
   */
  setProjection(projection) { }

  /**
   * Set the map view with the provided options. Uses OpenLayers style zoom levels.
   * @param {Object}  options            View options. All are optional
   * @param {Object}  options.center     The centre as {lat: <Number>, lon: <Number>}
   * @param {Object}  options.fitExtent  Extent to fit the view to, defined as
   *                                     {minLat: <Number>, minLon: <Number>, maxLat: <Number>, maxLon: <Number>}
   * @param {Object}  options.maxExtent  Extent to restrict the view to, defined as
   *                                     {minLat: <Number>, minLon: <Number>, maxLat: <Number>, maxLon: <Number>}
   * @param {Number}  options.maxZoom    The maximum allowed zoom
   * @param {Number}  options.minZoom    The minimum allowed zoom
   * @param {String}  options.projection The projection, such as 'EPSG:4326'
   * @param {Number}  options.zoom       The zoom
   */
  setView(options) { }

  /**
   * Add the specified data layer onto the map, using the specified options.
   * Will also add a Geona layer to the availableLayers if not already included.
   *
   * @param {Layer}   geonaLayer               The Geona Layer object to be created as an OpenLayers layer on the map.
   * @param {Object}  [options]                A list of options that affect the layers being added
   * @param {String}    options.modifier       Indicates that a layer is 'basemap', 'borders' or 'hasTime'.
   * @param {String}    options.requestedTime  The time requested for this layer.
   * @param {String}    options.requestedStyle The identifier of the style requested for this layer.
   * @param {Boolean}   options.shown          Whether to show or hide the layer when it is first put on the map.
   */
  addLayer(geonaLayer, options) { }

  /**
   * Remove the specified data layer from the map.
   * @param {String} layerIdentifier The id of the data layer being removed.
   */
  removeLayer(layerIdentifier) { }

  /**
   * Makes an invisible layer visible.
   * @param {String} layerIdentifier The id of the data layer being made visible.
   */
  showLayer(layerIdentifier) { }

  /**
   * Makes a layer invisible, but keeps it on the map.
   * @param {String} layerIdentifier The id of the data layer being made hidden.
   */
  hideLayer(layerIdentifier) { }

  /**
   * Moves the layer to the specified index, and reorders the other map layers where required.
   *
   * Displaced layers move downwards if the reordered layer is being moved up.
   * Displaced layers move upwards if the reordered layer is being moved down.
   * Basemaps and country borders will remain at the bottom or top, even if an attempt is made to move a data layer
   * lower or higher than the basemap or borders.
   *
   * The zIndex of all tile layers will be in a range of '0' to 'the number of layers - 1'.
   * For example, with a basemap, a data layer, and a country borders layer, the zIndex values would be
   * 0, 1, 2, in that order.
   *
   * @param {String}  layerIdentifier The identifier of the layer to be moved.
   * @param {Integer} targetIndex The zero-based index to insert the layer at. Higher values for higher layers.
   */
  reorderLayers(layerIdentifier, targetIndex) { }

  /**
   * Updates the layer time to the nearest, past valid time for that layer.
   * If no valid time is found, the layer is hidden.
   * @param {String} layerIdentifier The identifier for the layer being updated.
   * @param {String} requestedTime   The target time in ISO 8601 format.
   */
  loadNearestValidTime(layerIdentifier, requestedTime) { }

  /**
   * Loads all the data layers on the map to the nearest valid time, hiding the layers with no valid data.
   * @param {String} requestedTime The target time in ISO 8601 format.
   */
  loadLayersToNearestValidTime(requestedTime) { }

  /**
   * Changes the style of the specified layer.
   * @param {String} layerIdentifier The identifier for an active map layer.
   * @param {String} styleIdentifier The identifier for the desired style.
   */
  changeLayerStyle(layerIdentifier, styleIdentifier) { }

  /**
   * Translates a generic request for a layer key into an OpenLayers get() and returns the result.
   * Used for methods not specific to one map library (e.g. in the GUI).
   * @param  {String|ol.layer.Tile} layerIdentifier The identifier for the map layer we want to check,
   *                                                or the OpenLayers layer itself.
   * @param  {String}               key             The key that we want to find the value of.
   * @return {*}                                    The value for the requested key.
   */
  layerGet(layerIdentifier, key) { }

  /**
   * Load the default basemaps, and any defined in the config.
   */
  _loadBasemapLayers() { }

  /**
   * Load the default border layers, and any defined in the config.
   */
  _loadBordersLayers() { }

  /**
   * Load the default data layers, and any defined in the config.
   */
  _loadDataLayers() { }

  /**
  * Use the config to setup the map view.
  *
  * This should be called at the end of a map constructor.
  * This function should not be overridden.
  */
  loadConfig_() {
    // this.setBasemap(this.config.basemap);
    // this.setCountryBorders(this.config.borders);
    this.displayGraticule(this.config.graticule);
    // this.setProjection(this.config.projection);
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
