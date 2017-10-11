/** @module  map_leaflet */

import GeonaMap from './map';
import {
  basemaps as defaultBasemaps, borderLayers as defaultBorders, latLonLabelFormatter,
  addLayerDefaults, selectPropertyLanguage,
} from './map_common';
import CCI5DAY from './rsg.pml.ac.uk-thredds-wms-CCI_ALL-v3.0-5DAY';
import $ from 'jquery';

let L;

/**
 * Class for a Leaflet map.
 *
 * @implements {GeonaMap}
 */
export class LMap extends GeonaMap {
  /**
   * Instantiate a new LMap and create a new Leaflet map.
   * @param  {Object} config The map config to load
   * @param {HTMLElement} mapDiv The div to put the map in
   */
  constructor(config, mapDiv) {
    super();
    /** @type {Object} The map config */
    this.config = config;
    /**  @type {Object} The available map layers */
    this._availableLayers = {};
    /**  @type {L.featureGroup} The layers on the map */
    // TODO try putting '{attribution: 'Geona'}' in the featureGroup initially
    this._mapLayers = L.featureGroup();
    this._geonaLayers = [];
    /**  @type {L.latlngGraticule} The map graticule */
    this._graticule = L.latlngGraticule({
      showLabel: true,
      color: '#ccc',
      fontColor: '#ccc',
      opacity: 1,
      weight: 1,
      lineDash: [2, 3],
      zoomInterval: [
        {start: 2, end: 2, interval: 20},
        {start: 3, end: 3, interval: 10},
        {start: 4, end: 4, interval: 5},
        {start: 5, end: 5, interval: 2},
        {start: 6, end: 6, interval: 1},
        {start: 7, end: 7, interval: 0.5},
        {start: 8, end: 8, interval: 0.2},
        {start: 9, end: 9, interval: 0.1},
        {start: 10, end: 20, interval: 0.05},
      ],
      latFormatTickLabel: function(latitude) {
        return latLonLabelFormatter(latitude, 'N', 'S');
      },
      lngFormatTickLabel: function(longitude) {
        return latLonLabelFormatter(longitude, 'E', 'W');
      },
    });

    // TODO sort these when finished
    /** @type {Boolean} Whether the map currently has a basemap */
    this._basemap = false;
    /** @type {Boolean} Whether the map currently has country borders */
    this._borders = false;
    /** @private @type {Boolean} Tracks whether the map has been initialized */
    this._initialized = false;

    /**  @type {L.map} The Leaflet map */
    this._map = L.map(mapDiv, {
      crs: leafletizeProjection(this.config.projection),
      center: [this.config.viewSettings.center.lat, this.config.viewSettings.center.lon],
      maxBounds: [
        [this.config.viewSettings.maxExtent.minLat, this.config.viewSettings.maxExtent.minLon],
        [this.config.viewSettings.maxExtent.maxLat, this.config.viewSettings.maxExtent.maxLon],
      ],
      maxZoom: leafletizeZoom(this.config.viewSettings.maxZoom, leafletizeProjection(this.config.projection)),
      minZoom: leafletizeZoom(this.config.viewSettings.minZoom, leafletizeProjection(this.config.projection)),
      zoom: leafletizeZoom(this.config.viewSettings.zoom, leafletizeProjection(this.config.projection)),
      zoomControl: false,
    });

    L.control.zoom({
      zoomInText: '<span class="icon-zoom-in"></span>',
      zoomOutText: '<span class="icon-zoom-out"></span>',
      position: 'topright',
    }).addTo(this._map);

    L.control.scale({
      metric: true,
      imperial: false,
      position: 'topright',
    }).addTo(this._map);

    this._mapLayers.addTo(this._map);


    // Load the default basemaps and borders layers, plus any custom ones defined in the config
    this._loadBasemaps();
    this._loadCountryBorderLayers();

    this.addLayer(this._availableLayers['terrain-light'], 'basemap');
    // this._availableLayers.gebco_08_grid.addTo(this._map);
    // this._mapLayers.addLayer(this._availableLayers.gebco_08_grid);
    this.addLayer(this._availableLayers.line_black, 'borders');
    // this._availableLayers.line_black.addTo(this._map);
    // this._mapLayers.addLayer(this._availableLayers.line_black);

    this.loadConfig_();
    // Must come last in the constructor
    this._initialized = true;
  }

  /**
   * Set the graticule as visible or not.
   * @param  {Boolean} display True to display graticule
   */
  displayGraticule(display) {
    if (display) {
      this._graticule.addTo(this._map);
    } else {
      this._graticule.remove();
    }
  }

  /**
   * Clears the basemap if it exists and changes the projection if required.
   * @param {L.tileLayer.wms} [layer] The layer created in addLayer()
   */
  _clearBasemap(layer) {
    if (this.config.basemap !== 'none') {
      this._mapLayers.eachLayer((currentLayer) => {
        if (currentLayer.options.modifier === 'basemap') {
          currentLayer.remove();
        }
      });
      this.config.basemap = 'none';
    }
    if (layer !== undefined && this._map.options._crs !== layer.crs) {
      this.setProjection(deLeafletizeProjection(layer.crs));
    }
  }

  /**
   * Clears the country borders if active.
   */
  _clearBorders() {
    if (this.config.countryBorders !== 'none') {
      this._mapLayers.eachLayer((currentLayer) => {
        if (currentLayer.options.modifier === 'borders') {
          currentLayer.remove();
        }
      });
      this.config.countryBorders = 'none';
    }
  }

  /**
   * Set the projection, if supported by the current basemap.
   * @param {String} projection The projection to use, such as 'EPSG:4326'
   */
  setProjection(projection) {
    // TODO check the basemap supports the projection.
    // This is a bit of a hack and isn't officially supported by Leaflet. Everything may fall over!
    let leafletProjection = leafletizeProjection(projection);

    if (this._map.options.crs !== leafletProjection) {
      // If the map isn't already in the provided projection
      let center = this._map.getCenter();
      let zoom = this._map.getZoom();
      let maxZoom = this._map.getMaxZoom();
      let minZoom = this._map.getMinZoom();

      switch (projection) {
        case 'EPSG:3857':
          zoom += 1;
          maxZoom += 1;
          minZoom += 1;
          break;
        case 'EPSG:4326':
          zoom -= 1;
          maxZoom -= 1;
          minZoom -= 1;
          break;
      }

      this._map.options.crs = leafletProjection;
      this._map._resetView(center, zoom);

      this._map.setMaxZoom(maxZoom);
      this._map.setMinZoom(minZoom);

      this.config.projection = projection;

      this._map.eachLayer((layer) => {
        if (layer._crs !== undefined) {
          layer.remove();
          this._mapLayers.removeLayer(layer);
          // We add the same layer, but now the map projection will have changed.
          // eslint-disable-next-line new-cap
          let newLayer = new L.tileLayer.wms(layer._url, {
            layers: layer.options.layers,
            format: layer.wmsParams.format,
            transparent: layer.options.transparent,
            attribution: layer.options.attribution,
            version: layer.options.version,
            zIndex: layer.options.zIndex,
            modifier: layer.options.modifier,
          }).addTo(this._map);
          this._mapLayers.addLayer(newLayer);
        }
      });
    }
  }

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
  setView(options) {
    if (options.projection) {
      this.setProjection(options.projection);
      this.config.projection = options.projection;
    }

    if (options.maxExtent) {
      this._map.setMaxBounds([
        [options.maxExtent.minLat, options.maxExtent.minLon],
        [options.maxExtent.maxLat, options.maxExtent.maxLon],
      ]);
      // this._map.setMaxBounds([options.maxExtent.slice(0, 2), options.maxExtent.slice(2, 4)]);
      this.config.viewSettings.maxExtent = options.maxExtent;
    }

    if (options.center) {
      this._map.panTo([options.center.lat, options.center.lon]);
      // this._map.panTo(options.center);
      this.config.viewSettings.center = options.center;
    }

    if (options.maxZoom || options.minZoom || options.zoom) {
      let projection = leafletizeProjection(options.projection) || this._map.options.crs;

      if (options.maxZoom) {
        this._map.setMaxZoom(leafletizeZoom(options.maxZoom, projection));
        this.config.viewSettings.maxZoom = options.maxZoom;
      }
      if (options.minZoom) {
        this._map.setMinZoom(leafletizeZoom(options.minZoom, projection));
        this.config.viewSettings.minZoom = options.minZoom;
      }
      if (options.zoom) {
        this._map.setZoom(leafletizeZoom(options.zoom, projection));
        this.config.viewSettings.zoom = options.zoom;
      }
    }

    if (options.fitExtent) {
      this._map.setMaxBounds([
        [options.fitExtent.minLat, options.fitExtent.minLon],
        [options.fitExtent.maxLat, options.fitExtent.maxLon],
      ]);
      // this._map.fitBounds([options.fitExtent.slice(0, 2), options.fitExtent.slice(2, 4)]);
      this.config.viewSettings.fitExtent = options.fitExtent;
    }
  }

  /**
   * Set the map view with the provided options. The same as setView, but uses Leaflet style zoom levels and projection.
   * @param {Object}  options            View options. All are optional
   * @param {Array}   options.center     The centre as [lat, lon]
   * @param {Array}   options.fitExtent  Extent to fit the view to, defined as [minLat, minLon, maxLat, maxLon]
   * @param {Array}   options.maxExtent  Extent to restrict the view to, defined as [minLat, minLon, maxLat, maxLon]
   * @param {Number}  options.maxZoom    The maximum allowed zoom
   * @param {Number}  options.minZoom    The minimum allowed zoom
   * @param {L.CRS}   options.projection The projection
   * @param {Number}  options.zoom       The zoom
   */
  _setView(options) {
    if (options.projection) {
      // options.projection = leafletizeProjection(options.projection);
      options.projection = deLeafletizeProjection(options.projection);
    }

    if (options.maxZoom || options.minZoom || options.zoom) {
      let projection = options.projection || this._map.options.crs;

      if (options.maxZoom) {
        options.maxZoom = deLeafletizeZoom(options.maxZoom, projection);
      }
      if (options.minZoom) {
        options.minZoom = deLeafletizeZoom(options.minZoom, projection);
      }
      if (options.zoom) {
        options.zoom = deLeafletizeZoom(options.zoom, projection);
      }
    }

    this.setView(options);
  }

  /**
   * Create a Leaflet map layer from a Geona layer definition, and add to the map.
   * @param {Layer}   geonaLayer A Layer as defined by Geona, by parsing the GetCapabilities request from a server.
   * @param {String}  [modifier] An optional String used to indicate that a layer is 'basemap' or 'borders'
   */
  addLayer(geonaLayer, modifier) {
    // If a layer is a basemap we might change the projection
    // anyway, so it doesn't matter if the layer supports the current projection
    console.log(geonaLayer);
    if (geonaLayer.projections.includes(deLeafletizeProjection(this._map.options.crs)) || modifier === 'basemap') {
      let layer;
      let title;
      let time;
      let requiredLayer;
      let format;
      let projection;
      switch (geonaLayer.PROTOCOL) {
        case 'wms':
          title = geonaLayer.title.und;
          // Select the closest time to current map layers, or the most recent time
          if (geonaLayer.isTemporal === true) {
            // Change to be the closest time previous to the current layers' times
            // i.e. if (currently a temporal layer on the map) {...} else {set to lastTime}
            time = geonaLayer.lastTime;
          }
          // FIXME this is basically only here for the border layers, but it might break if another layer has a single layer as an Object rather than a String
          requiredLayer = geonaLayer.layerServer.layers;
          if (geonaLayer.layerServer.layers.length !== 1) {
            requiredLayer = geonaLayer.identifier;
          }
          // FIXME fix parser so this doesn't happen
          if ($.isEmptyObject(geonaLayer.styles)) {
            geonaLayer.styles = undefined;
          }
          // Select an appropriate format
          // FIXME this probably needs reevaluating - try to use the format from the LegendURL of the Style.
          if (geonaLayer.formats !== undefined) {
            if (geonaLayer.formats.includes('image/png')) {
              format = 'image/png';
            } else if (geonaLayer.formats.includes('image/jpeg')) {
              format = 'image/jpeg';
            } else {
              format = geonaLayer.formats[0];
            }
          }
          // At this stage of the method, only basemaps might have different projections.
          if (geonaLayer.projections.includes(deLeafletizeProjection(this._map.options.crs))) {
            projection = this._map.options.crs;
          } else {
            projection = leafletizeProjection(geonaLayer.projections[0]);
          }
          // eslint-disable-next-line new-cap
          layer = new L.tileLayer.wms(geonaLayer.layerServer.url, {
            identifier: geonaLayer.identifier,
            layers: requiredLayer,
            styles: geonaLayer.styles || 'boxfill/alg',
            format: format || 'image/png',
            transparent: true,
            attribution: geonaLayer.attribution,
            version: geonaLayer.layerServer.version,
            crs: projection,
          });
          if (modifier !== undefined) {
            layer.options.modifier = modifier;
          }
          break;
        case 'wmts':
          alert('WMTS is not supported for Leaflet');
          break;
      }
      if (modifier === 'basemap') {
        this._clearBasemap(layer);
      } else if (modifier === 'borders') {
        this._clearBorders();
      }

      layer.addTo(this._map);
      this._mapLayers.addLayer(layer);

      if (modifier === 'basemap') {
        this.reorderLayers(layer.identifier, 0);
        this.config.basemap = layer.identifier;
      } else if (modifier === 'borders') {
        this.config.countryBorders = layer.identifier;
      }

      this._geonaLayers.push(geonaLayer);

      // We always want the country borders to be on top, so we reorder them to the top each time we add a layer.
      // FIXME
      if (this.config.countryBorders !== 'none' && this._initialized === true) {
        this.reorderLayers(this.config.countryBorders, this._mapLayers.length);
      }
    } else {
      alert('Cannot use this projection for this layer');
    }
  }

  /**
   * Removes the layer from the map.
   * @param {String} layerIdentifier The identifier of the layer being removed.
   */
  removeLayer(layerIdentifier) {
    for (let layer of this._mapLayers.getLayers()) {
      if (layer.options.identifier === layerIdentifier) {
        layer.remove();
        this._mapLayers.removeLayer(layer);
        if (layer.options.modifier === 'basemap') {
          this.config.basemap = 'none';
        } else if (layer.options.modifier === 'borders') {
          this.config.countryBorders = 'none';
        }
      }
    }
  }

  /**
   * Hides the layer from view, whilst keeping it on the map.
   * @param {*} layerIdentifier The identifier for the layer being hidden.
   */
  hideLayer(layerIdentifier) {
    for (let layer of this._mapLayers.getLayers()) {
      if (layer.options.identifier === layerIdentifier) {
        layer.setOpacity(0);
      }
    }
  }

  /**
   * Reveals the layer on the map.
   * @param {*} layerIdentifier The identifier for the layer being shown.
   */
  showLayer(layerIdentifier) {
    for (let layer of this._mapLayers.getLayers()) {
      if (layer.options.identifier === layerIdentifier) {
        layer.setOpacity(1);
      }
    }
  }

  /**
   * Moves the layer to the specified index, and reorders the other map layers where required.
   * Displaced layers move downwards when reordered.
   * @param {String}  layerIdentifier The identifier of the layer to be moved.
   * @param {Integer} index The zero-based index to insert the layer at. Higher values for higher layers.
   */
  reorderLayers(layerIdentifier, index) {
    let layer;
    console.log(this._mapLayers);
    for (let currentLayer of this._mapLayers.getLayers()) {
      // TODO check
      if (currentLayer.identifier === layerIdentifier) {
        layer = currentLayer;
      }
    }
    if (layer !== undefined) {
      for (let currentLayer of this._mapLayers.getLayers()) {
        if (currentLayer._crs !== undefined) {
          if (currentLayer.options.zIndex <= index) {
            // Leaflet layers use higher values for higher positioning.
            currentLayer.options.zIndex -= 1;
          }
        }
      }
      layer.options.zIndex = index;
    } else {
      alert('Layer ' + layerIdentifier + ' does not exist on the map.');
    }
  }

  /**
   * Load the data layers defined in the config
   */
  _loadLayers() {
    for (let addedLayer of this.config.layers) {
      addedLayer = addLayerDefaults(addedLayer);

      let layerData;
      for (let serverLayer of CCI5DAY.server.Layers) {
        if (serverLayer.Name === addedLayer.identifier) {
          layerData = serverLayer;
        }
      }

      // let tile;
      switch (addedLayer.source.type) {
        case 'wms':
          this._availableLayers[addedLayer.identifier] = L.tileLayer.wms(addedLayer.source.url, {
            layers: addedLayer.source.params.layers,
            version: addedLayer.source.params.version,
            attribution: addedLayer.source.attributions,
            projections: addedLayer.projections,
            viewSettings: addedLayer.viewSettings,
            layerData: layerData,
          });
          break;
        case 'wmts':
          console.error('WMTS not supported for Leaflet');
          break;
      }
    }
  }

  /**
   * Load the default basemaps, and any defined in the config.
   */
  _loadBasemaps() {
    // TODO load from config too
    for (let layer of defaultBasemaps) {
      if (layer.PROTOCOL !== 'bing' || (layer.PROTOCOL === 'bing' && this.config.bingMapsApiKey)) {
        this._availableLayers[layer.identifier] = layer;
      } else {
        console.error('bingMapsApiKey is null or undefined');
      }
    }
  }

  /**
   * Load the default border layers, and any defined in the config.
   */
  _loadCountryBorderLayers() {
    // TODO load from config too
    for (let layer of defaultBorders) {
      this._availableLayers[layer.identifier] = layer;
    }
  }
}

/**
 * Adjust a provided OpenLayers style zoom level to be correct for leaflet.
 * @param  {Number} zoom       OpenLayers style zoom level
 * @param  {L.CRS}  projection The projection that the zoom is for
 * @return {Number}            Leaflet style zoom level
 */
function leafletizeZoom(zoom, projection) {
  switch (projection) {
    case L.CRS.EPSG3857:
      return zoom;
    case L.CRS.EPSG4326:
      return zoom - 1;
    default:
      return zoom;
  }
}

/**
 * Adjust a provided Leaflet style zoom level to be correct for OpenLayers.
 * @param  {Number} zoom       Leaflet style zoom level
 * @param  {L.CRS}  projection The projection that the zoom is for
 * @return {Number}            OpenLayers style zoom level
 */
function deLeafletizeZoom(zoom, projection) {
  switch (projection) {
    case L.CRS.EPSG3857:
      return zoom;
    case L.CRS.EPSG4326:
      return zoom + 1;
    default:
      return zoom;
  }
}

/**
 * Convert a projection string to a Leaflet CRS object
 * @param  {String} projection A projection string
 * @return {L.CRS}             A leaflet CRS object
 */
function leafletizeProjection(projection) {
  switch (projection) {
    case 'EPSG:3395':
      return L.CRS.EPSG3395;
    case 'EPSG:3857':
      return L.CRS.EPSG3857;
    case 'EPSG:4326':
      return L.CRS.EPSG4326;
    default:
      return null;
  }
}

/**
 * Convert a Leaflet CRS object into a projection string
 * @param  {L.CRS}  projection A leaflet CRS object
 * @return {String}            A projection string
 */
function deLeafletizeProjection(projection) {
  switch (projection) {
    case L.CRS.EPSG3395:
      return 'EPSG:3395';
    case L.CRS.EPSG3857:
      return 'EPSG:3857';
    case L.CRS.EPSG4326:
      return 'EPSG:4326';
    default:
      return null;
  }
}

/**
 * Load the Leaflet library and any Leaflet plugins
 * @param {String}   geonaServer The url of the Geona Server, or ""
 * @param {Function} next
 */
export function init(geonaServer, next) {
  if (L) {
    // If leaflet has already been loaded
    next();
  } else {
    let head = document.getElementsByTagName('head')[0];
    let mapJs = document.createElement('script');
    mapJs.onload = function() {
      import('leaflet')
        .then((leaflet) => {
          L = leaflet;

          // Import Leaflet plugins
          return Promise.all([
            import('../vendor/js/leaflet_latlng_graticule'),
          ]);
        })
        .then(() => {
          next();
        });
    };
    mapJs.src = geonaServer + '/js/vendor_leaflet.js';
    head.appendChild(mapJs);
  }
}
