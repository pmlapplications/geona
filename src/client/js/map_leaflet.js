/** @module  map_leaflet */

import GeonaMap from './map';
import {
  loadDefaultLayersAndLayerServers, latLonLabelFormatter, findNearestValidTime,
} from './map_common';
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
    this._mapLayers = L.featureGroup();
    this._activeLayers = {};
    /** @type {String} The time the map is set to */
    this._mapTime = undefined;
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

    this._map.attributionControl.setPrefix('<a href="http://leafletjs.com/"> <img border="0" width="10px" height="10px" target="_blank" alt="Leaflet" src="https://raw.githubusercontent.com/Leaflet/Leaflet/master/docs/docs/images/favicon.ico"></a> Geona');

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


    // Load the default basemaps, borders layers, and data layers.
    let loadedServersAndLayers = loadDefaultLayersAndLayerServers(this.config);
    this._availableLayers = loadedServersAndLayers.availableLayers;
    this._availableLayerServers = loadedServersAndLayers.availableLayerServers;

    // Adds any defined basemap to the map
    if (this.config.basemap !== 'none' && this.config.basemap !== undefined) {
      let layer = this._availableLayers[this.config.basemap];
      let layerServer = this._availableLayerServers[layer.layerServer];
      this.addLayer(layer, layerServer, {modifier: 'basemap'});
    }
    // Adds all defined data layers to the map
    if (this.config.data !== undefined) {
      if (this.config.data.length !== 0) {
        for (let layerIdentifier of this.config.data) {
          let layer = this._availableLayers[layerIdentifier];
          let layerServer = this._availableLayerServers[layer.layerServer];
          if (this._availableLayers[layerIdentifier].modifier === 'hasTime') {
            this.addLayer(layer, layerServer, {modifier: 'hasTime'});
          } else {
            this.addLayer(layer, layerServer);
          }
        }
      }
    }
    // Adds any defined borders layer to the map
    if (this.config.borders.identifier !== 'none' && this.config.borders.identifier !== undefined) {
      let layer = this._availableLayers[this.config.borders.identifier];
      let layerServer = this._availableLayerServers[layer.layerServer];
      this.addLayer(layer, layerServer, {modifier: 'borders', requestedStyle: this.config.borders.style});
    }

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
          this.removeLayer(currentLayer.options.identifier);
        }
      });
    }
    if (layer !== undefined && this._map.options._crs !== layer.crs) {
      this.setProjection(deLeafletizeProjection(layer.crs));
    }
  }

  /**
   * Clears the country borders if active.
   */
  _clearBorders() {
    if (this.config.borders.identifier !== 'none') {
      this._mapLayers.eachLayer((currentLayer) => {
        if (currentLayer.options.modifier === 'borders') {
          this.removeLayer(currentLayer.options.identifier);
        }
      });
    }
  }

  /**
   * Set the projection, if supported by the current basemap.
   * @param {String}  projection The projection to use, such as 'EPSG:4326'
   * @return {String}            The new map projection
   */
  setProjection(projection) {
    let basemapSupportsProjection = true;
    let basemapIdentifier = '';
    if (this.config.basemap !== 'none') {
      for (let layer of this._mapLayers.getLayers()) {
        if (layer.options.modifier === 'basemap') {
          basemapIdentifier = layer.options.identifier;
          let basemapProjections = this._availableLayers[basemapIdentifier].projections;
          if (!basemapProjections.includes(projection)) {
            basemapSupportsProjection = false;
          }
        }
      }
    }

    if (basemapSupportsProjection === true) {
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
            this.removeLayer(layer.options.identifier);
            // We add the same layer, but now the map projection will have changed.
            let geonaLayer = this._availableLayers[layer.options.identifier];
            let geonaLayerServer = this._availableLayerServers[geonaLayer.layerServer];
            let options = {
              modifier: layer.options.modifier,
              requestedTime: layer.options.layerTime,
              requestedStyle: layer.options.styles,
              shown: layer.options.shown,
            };
            this.addLayer(geonaLayer, geonaLayerServer, options);
          }
        });
      }
      return projection;
    } else {
      alert('Basemap ' + basemapIdentifier + ' does not support projection type ' + projection + '. Please select a different basemap.');
      return this._map.options.crs.code;
    }
  }

  /**
   * Set the map view with the provided options. Uses OpenLayers-style zoom levels.
   * @param {Object}  options            View options. All are optional
   *   @param {Object}  options.center     The centre as {lat: <Number>, lon: <Number>}
   *   @param {Object}  options.fitExtent  Extent to fit the view to, defined as
   *                                       {minLat: <Number>, minLon: <Number>, maxLat: <Number>, maxLon: <Number>}
   *   @param {Object}  options.maxExtent  Extent to restrict the view to, defined as
   *                                       {minLat: <Number>, minLon: <Number>, maxLat: <Number>, maxLon: <Number>}
   *   @param {Number}  options.maxZoom    The maximum allowed zoom
   *   @param {Number}  options.minZoom    The minimum allowed zoom
   *   @param {String}  options.projection The projection, such as 'EPSG:4326'
   *   @param {Number}  options.zoom       The zoom
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

    let projection = leafletizeProjection(options.projection) || this._map.options.crs;
    if (options.maxZoom || options.minZoom || options.zoom) {
      // let projection = leafletizeProjection(options.projection) || this._map.options.crs;

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
    } else {
      // Set the zoom to the current zoom
      this._map.setZoom(leafletizeZoom(this.config.viewSettings.zoom, projection));
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
   * Will also add a Geona layer to the _availableLayers if not already included.
   *
   * @param {Layer}       geonaLayer       A Layer as defined by Geona, by parsing the GetCapabilities request from a server.
   * @param {LayerServer} geonaLayerServer The LayerServer corresponding to the layer
   * @param {Object}      [options]        A list of options that affect the layers being added
   *   @param {String}  options.modifier       Indicates that a layer is 'basemap', 'borders' or 'hasTime'.
   *   @param {String}  options.requestedTime  The time requested for this layer.
   *   @param {String}  options.requestedStyle The identifier of the style requested for this layer.
   *   @param {Boolean} options.shown          Whether to show or hide the layer when it is first put on the map.
   */
  addLayer(geonaLayer, geonaLayerServer, options = {modifier: undefined, requestedTime: undefined, requestedStyle: undefined, shown: true}) {
    // Set default options if not specified
    // No need to set modifier and requestedTime
    if (options.shown === undefined) {
      options.shown = true;
    }

    // Checks the map for any layers with the same identifier as the layer being added
    let duplicate = false;
    for (let layer of this._mapLayers.getLayers()) {
      if (layer.options.identifier === geonaLayer.identifier) {
        duplicate = true;
      }
    }
    // We enforce that identifiers must be unique on the map.
    // TODO offer option of changing identifier.
    if (duplicate === true) {
      alert('Layer with this identifier already exists on the map.');
    } else
    // If a layer is a basemap we might change the projection
    // anyway, so it doesn't matter if the layer supports the current projection
    if (geonaLayer.projections.includes(deLeafletizeProjection(this._map.options.crs)) || options.modifier === 'basemap') {
      let attribution;
      let format;
      let layer;
      let projection;
      let requiredLayer;
      let style;
      let title;
      let time;

      switch (geonaLayer.protocol) {
        case 'wms':
          title = geonaLayer.title.und;
          requiredLayer = geonaLayer.identifier;
          // FIXME fix parser so this doesn't happen
          if ($.isEmptyObject(geonaLayer.styles)) {
            geonaLayer.styles = undefined;
          }
          // Select an appropriate format
          // If a format is found in the layer style, the format is set to that instead
          if (geonaLayer.formats !== undefined) {
            if (geonaLayer.formats.includes('image/png')) {
              format = 'image/png';
            } else if (geonaLayer.formats.includes('image/jpeg')) {
              format = 'image/jpeg';
            } else {
              format = geonaLayer.formats[0];
            }
          }
          // Select appropriate style
          if (geonaLayer.styles !== undefined) {
            // Default to the first style
            style = geonaLayer.styles[0].identifier;
            if (geonaLayer.styles[0].legendUrl !== undefined) {
              format = geonaLayer.styles[0].legendUrl[0].format;
            }
            // Search for the requested style and set that as the style if found
            // FIXME if the requested style is not available, throw an error and print out list of available styles
            for (let layerStyle of geonaLayer.styles) {
              if (layerStyle.identifier === options.requestedStyle) {
                style = options.requestedStyle;
                if (layerStyle.legendUrl !== undefined) {
                  format = layerStyle.legendUrl[0].format;
                }
              }
            }
          }

          // At this stage of the method, only basemaps might have different projections.
          if (geonaLayer.projections.includes(deLeafletizeProjection(this._map.options.crs))) {
            projection = this._map.options.crs;
          } else {
            projection = leafletizeProjection(geonaLayer.projections[0]);
          }
          if (geonaLayer.attribution) {
            if (geonaLayer.attribution.onlineResource) {
              attribution = geonaLayer.attribution.onlineResource;
            } else {
              attribution = geonaLayer.attribution.title;
            }
          }

          // Selects the requested time, the closest to the map time, or the default layer time.
          if (options.requestedTime !== undefined) {
            time = findNearestValidTime(geonaLayer, options.requestedTime);
          } else if (options.modifier === 'hasTime' && this._mapTime !== undefined) {
            time = findNearestValidTime(geonaLayer, this._mapTime);
          } else if (options.modifier === 'hasTime') {
            if (geonaLayer.dimensions) {
              if (geonaLayer.dimensions.time) {
                time = geonaLayer.dimensions.time.default;
              }
            }
          }

          // Leaflet doesn't officially support time, but all the parameters get put into the URL anyway
          // This is why we have 'time', 'Time' and 'TIME' to cover all cases
          if (options.modifier === 'hasTime' && time !== undefined) {
            // eslint-disable-next-line new-cap
            layer = new L.tileLayer.wms(geonaLayerServer.url, {
              identifier: geonaLayer.identifier,
              layers: requiredLayer,
              styles: style || '',
              format: format || 'image/png',
              transparent: true,
              attribution: attribution,
              version: geonaLayerServer.version,
              crs: projection,
              time: time,
              Time: time,
              TIME: time,
              zIndex: this._mapLayers.getLayers().length,
              modifier: options.modifier,
              layerTime: time,
              shown: options.shown,
              opacity: 1,
              timeHidden: false,
            });
          } else {
            // eslint-disable-next-line new-cap
            layer = new L.tileLayer.wms(geonaLayerServer.url, {
              identifier: geonaLayer.identifier,
              layers: requiredLayer,
              styles: style || '',
              format: format || 'image/png',
              transparent: true,
              attribution: attribution,
              version: geonaLayerServer.version,
              crs: projection,
              zIndex: this._mapLayers.getLayers().length,
              modifier: options.modifier,
              layerTime: time,
              shown: options.shown,
              opacity: 1,
              timeHidden: false,
            });
          }
          break;
        case 'wmts':
          alert('WMTS is not supported for Leaflet');
          break;
        case undefined:
          throw new Error('Layer protocol is undefined');
      }

      if (this._availableLayers[geonaLayer.identifier] === undefined) {
        geonaLayer.modifier = options.modifier;
        this._availableLayers[geonaLayer.identifier] = geonaLayer;
        // Save the LayerServer if not already saved
        if (this._availableLayerServers[geonaLayerServer.identifier] === undefined) {
          delete geonaLayerServer.layers;
          this._availableLayerServers[geonaLayerServer.identifier] = geonaLayerServer;
        }
      }

      this._activeLayers[geonaLayer.identifier] = layer;

      if (options.modifier === 'basemap') {
        this._clearBasemap(layer);
      } else if (options.modifier === 'borders') {
        this._clearBorders();
      }

      // Sets the map time if this is the first layer
      if (this._mapTime === undefined && time !== undefined) {
        this._mapTime = time;
      }

      layer.addTo(this._map);
      this._mapLayers.addLayer(layer);

      if (options.shown === false) {
        layer.setOpacity(0);
        layer.options.opacity = 0;
      }

      if (options.modifier === 'basemap') {
        this.reorderLayers(layer.options.identifier, 0);
        this.config.basemap = layer.options.identifier;
      } else if (options.modifier === 'borders') {
        this.config.borders.identifier = layer.options.identifier;
        this.config.borders.style = style;
      } else if (this._initialized === true) {
        // this.config.data.push(layer.options.identifier);
      }

      // We always want the country borders to be on top, so we reorder them to the top each time we add a layer.
      if (this.config.borders.identifier !== 'none' && this._initialized === true) {
        this.reorderLayers(this.config.borders.identifier, this._mapLayers.getLayers().length - 1);
      }

      if (geonaLayer.viewSettings !== undefined) {
        this.setView({
          center: geonaLayer.viewSettings.center,
          fitExtent: geonaLayer.viewSettings.fitExtent,
          maxExtent: geonaLayer.viewSettings.maxExtent,
          maxZoom: geonaLayer.viewSettings.maxZoom,
          minZoom: geonaLayer.viewSettings.minZoom,
          projection: deLeafletizeProjection(projection),
          zoom: geonaLayer.viewSettings.zoom,
        });
      } else {
        this.setView({
          projection: deLeafletizeProjection(projection),
        });
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
        this._mapLayers.removeLayer(layer);
        layer.remove();
        delete this._activeLayers[layerIdentifier];
        if (layer.options.modifier === 'basemap') {
          this.config.basemap = 'none';
          // As we have removed the basemap, the zIndices should all be reduced by 1
          for (let remainingLayer of this._mapLayers.getLayers()) {
            remainingLayer.setZIndex(remainingLayer.options.zIndex - 1);
          }
        } else if (layer.options.modifier === 'borders') {
          this.config.borders.identifier = 'none';
          this.config.borders.style = 'none';
        } else if (layer.options.modifier === 'hasTime' || layer.options.modifier === undefined) {
          let zIndex = layer.options.zIndex;
          for (let dataLayer of this._mapLayers.getLayers()) {
            if (dataLayer.options.zIndex > zIndex) {
              dataLayer.options.zIndex = dataLayer.options.zIndex - 1;
            }
          }
          let data = this.config.data;
          for (let i = data.length; i > 0; i--) {
            if (data[i] === layerIdentifier) {
              this.config.data.splice(i, 1);
            }
          }
        }
        // If this was the last data layer, the map time should be reset - we will use the dataLayersCounter for this.
        let dataLayersCounter = 0;
        for (let dataLayer of this._mapLayers.getLayers()) {
          if (dataLayer.options.modifier === 'hasTime') {
            dataLayersCounter++;
          }
        }
        if (dataLayersCounter === 0) {
          this._mapTime = undefined;
        }
      }
    }
  }

  /**
   * Reveals the layer on the map.
   * @param {String} layerIdentifier The identifier for the layer being shown.
   */
  showLayer(layerIdentifier) {
    if (this._activeLayers[layerIdentifier] !== undefined) {
      // We don't want to reveal the layer if it's been hidden due to invalid time
      if (this._activeLayers[layerIdentifier].options.timeHidden === false) {
        // This changes all the tiles of the layer to be completely see-through
        this._activeLayers[layerIdentifier].setOpacity(1);
        // There is no corresponding getOpacity() method so we have to update our options manually
        this._activeLayers[layerIdentifier].options.opacity = 1;
      }
      // A layer hidden due to being having no data at the current time will be shown again once there is data available
      this._activeLayers[layerIdentifier].options.shown = true;
    }
  }

  /**
   * Hides the layer from view, whilst keeping it on the map.
   * @param {String} layerIdentifier The identifier for the layer being hidden.
   */
  hideLayer(layerIdentifier) {
    if (this._activeLayers[layerIdentifier] !== undefined) {
      // This changes all the tiles of the layer to be completely see-through
      this._activeLayers[layerIdentifier].setOpacity(0);
      // There is no corresponding getOpacity() method so we have to update our options manually
      this._activeLayers[layerIdentifier].options.opacity = 0;
      // A layer hidden due to being having no data at the current time will remain hidden once there is data available
      this._activeLayers[layerIdentifier].options.shown = false;
    }
  }

  /**
   * Moves the layer to the specified index, and reorders the other map layers where required.
   *
   * Displaced layers move downwards if the reordered layer is being moved up.
   * Displaced layers move upwards if the reordered layer is being moved down.
   * Basemaps and country borders will remain at the bottom or top, even if an attempt is made to move a data layer
   * lower or higher than the basemap or borders.
   *
   * The zIndex of all tile layers will be in a range of '0' to 'the number of layers - 1'.
   * For example, with a basemap, a data layer, and a country borders
   * layer, the zIndex values would be 0, 1, 2, in that order.
   *
   * @param {String}  layerIdentifier The identifier of the layer to be moved.
   * @param {Integer} targetIndex The zero-based index to insert the layer at. Higher values for higher layers.
   */
  reorderLayers(layerIdentifier, targetIndex) {
    let layer;
    let layerModifier;
    for (let mapLayer of this._mapLayers.getLayers()) {
      if (mapLayer.options.identifier === layerIdentifier) {
        layerModifier = mapLayer.options.modifier;
      }
    }
    let maxZIndex = this._mapLayers.getLayers().length - 1;

    if (this.config.basemap !== 'none' && targetIndex <= 0 && layerModifier !== 'basemap' && this._initialized === true) {
      // There is an active basemap, which must stay at index 0. 0 is the lowest sane index allowed.
      throw new Error('Attempt was made to move data layer below basemap. Basemaps must always be at position 0.');
    } else if (this.config.basemap === 'none' && targetIndex < 0 && this._initialized === true) {
      // There is no basemap, but the lowest allowed index is 0.
      throw new Error('Attempt was made to move layer below 0. The lowest layer must always be at position 0.');
    } else if (this.config.borders.identifier !== 'none' && targetIndex >= maxZIndex && layerModifier !== 'borders' && this._initialized === true) {
      // There is a borders layer, which must stay one position above the rest of the layers.
      throw new Error('Attempt was made to move data layer above borders. Borders must always be at the highest position.');
    } else if (this.config.borders.identifier === 'none' && targetIndex > maxZIndex && this._initialized === true) {
      // There is no borders layer, but the index is higher than the number of layers - 1.
      throw new Error('Attempt was made to move layer above the highest sane zIndex. The highest layer must always be one position above the rest.');
    } else {
      for (let currentLayer of this._mapLayers.getLayers()) {
        if (currentLayer.options.identifier === layerIdentifier) {
          layer = currentLayer;
        }
      }
      if (layer !== undefined) {
        if (layer.options.zIndex < targetIndex) {
          // We are moving the layer up
          for (let currentLayer of this._mapLayers.getLayers()) {
            if (currentLayer.options.zIndex <= targetIndex && currentLayer.options.zIndex > layer.options.zIndex) {
              // Layers use higher values for higher positioning.
              let newZIndex = currentLayer.options.zIndex - 1;
              currentLayer.setZIndex(newZIndex);
            }
          }
        } else if (layer.options.zIndex > targetIndex) {
          // We are moving the layer down
          for (let currentLayer of this._mapLayers.getLayers()) {
            if (currentLayer.options.zIndex >= targetIndex && currentLayer.options.zIndex < layer.options.zIndex) {
              // Layers use higher values for higher positioning.
              let newZIndex = currentLayer.options.zIndex + 1;
              currentLayer.setZIndex(newZIndex);
            }
          }
        }

        layer.setZIndex(targetIndex);
      } else {
        // console.error('Layer ' + layerIdentifier + ' cannot be reordered, as it does not exist on the map.');
        throw new Error('No layer with identifier \'' + layerIdentifier + '\' exists on the map');
      }
    }
  }

  /**
     * Updates the layer time to the nearest, past valid time for that layer.
     * If no valid time is found, the layer is hidden.
     * @param {String} layerIdentifier The identifier for the layer being updated.
     * @param {String} requestedTime   The target time in ISO 8601 format.
     */
  loadNearestValidTime(layerIdentifier, requestedTime) {
    // We use time values from the Geona layer object
    let geonaLayer = this._availableLayers[layerIdentifier];
    if (geonaLayer === undefined) {
      throw new Error('No Geona layer with this identifier has been loaded.');
    } else if (this._activeLayers[layerIdentifier] === undefined) {
      throw new Error('No layer with this identifier is on the map.');
    } else if (this._activeLayers[layerIdentifier].options.modifier !== 'hasTime') {
      let modifier = this._activeLayers[layerIdentifier].options.modifier;
      throw new Error('Cannot change the time of a ' + modifier + ' layer.');
    } else {
      // We find the nearest, past valid time for this layer
      let time = findNearestValidTime(geonaLayer, requestedTime);
      if (time === undefined) {
        // If the requested time is earlier than the earliest possible time for the layer, we hide the layer
        // We don't use the hideLayer() method because we don't want to update the state of the 'shown' option
        this._activeLayers[layerIdentifier].setOpacity(0);
        this._activeLayers[layerIdentifier].options.opacity = 0;
        this._activeLayers[layerIdentifier].options.timeHidden = true;
        // We also set the map time to be the requestedTime, so when we sort below we have an early starting point.
        this._mapTime = requestedTime;
      } else {
        // We save the zIndex so we can reorder the layer to it's current position when we re-add it
        let zIndex = this._activeLayers[layerIdentifier].options.zIndex;

        // We define the layer options so that only the time changes
        let layerOptions = {
          modifier: 'hasTime',
          requestedStyle: this._activeLayers[layerIdentifier].options.styles,
          // We save the layer's 'shown' value so the layer's state of visibility is kept upon changing time
          shown: this._activeLayers[layerIdentifier].options.shown,
          requestedTime: time,
        };

        this.removeLayer(layerIdentifier);
        let geonaLayerServer = this._availableLayerServers[geonaLayer.layerServer];
        this.addLayer(geonaLayer, geonaLayerServer, layerOptions);
        this.reorderLayers(layerIdentifier, zIndex);
        this._activeLayers[layerIdentifier].options.timeHidden = false;

        // We also set the map time to be the new layer time, so when we sort below we will have a valid starting point.
        this._mapTime = time;
      }

      // We now find the latest map time.
      let mapTime = new Date(this._mapTime);

      // We compare the map data layers to find the latest time for the visible data layers
      for (let layer of this._mapLayers.getLayers()) {
        // We check for visibility so that the map time will be the requested time if all layers are hidden
        if (layer.options.modifier === 'hasTime' && layer.options.opacity < 0) {
          let layerTime = new Date(layer.options.layerTime);
          if (layerTime > mapTime) {
            this._mapTime = layer.options.layerTime;
            mapTime = new Date(layer.options.layerTime);
          }
        }
      }
    }
  }

  /**
   * Loads all the data layers on the map to the nearest valid time, hiding the layers with no valid data.
   * @param {String} requestedTime The target time in ISO 8601 format.
   */
  loadLayersToNearestValidTime(requestedTime) {
    // layersAtStart holds the identifiers for the layers before we start changing all their times.
    let layersAtStart = Object.keys(this._activeLayers);

    for (let layerIdentifier of layersAtStart) {
      if (this._activeLayers[layerIdentifier].options.modifier === 'hasTime') {
        this.loadNearestValidTime(layerIdentifier, requestedTime);
      }
    }
  }

  /**
   * Changes the style of the specified layer.
   * @param {String} layerIdentifier The identifier for an active map layer.
   * @param {String} styleIdentifier The identifier for the desired style.
   */
  changeLayerStyle(layerIdentifier, styleIdentifier) {
    let layer = this._activeLayers[layerIdentifier];
    let geonaLayer = this._availableLayers[layerIdentifier];

    if (geonaLayer === undefined) {
      throw new Error('The layer ' + layerIdentifier + ' is not loaded into this Geona instance.');
    } else if (layer === undefined) {
      throw new Error('The layer ' + layerIdentifier + ' is not active on the map.');
    } else {
      if (geonaLayer.styles) {
        let validStyle = false;
        for (let style of geonaLayer.styles) {
          if (style.identifier === styleIdentifier) {
            validStyle = true;
          }
        }
        if (validStyle === true) {
          // Save the layer options for re-adding
          let layerOptions = {
            modifier: layer.options.modifier,
            requestedTime: layer.options.layerTime,
            shown: layer.options.shown,
            requestedStyle: styleIdentifier,
          };
          // Save the z-index so the layer remains in position
          let zIndex = layer.options.zIndex;

          this.removeLayer(layerIdentifier);
          let geonaLayerServer = this._availableLayerServers[geonaLayer.layerServer];
          this.addLayer(geonaLayer, geonaLayerServer, layerOptions);
          this.reorderLayers(layerIdentifier, zIndex);
        } else {
          throw new Error('Specified style ' + styleIdentifier + ' is not defined for the layer ' + layerIdentifier + '.');
        }
      } else {
        throw new Error('There are no styles specified for the layer ' + layerIdentifier + '.');
      }
    }
  }

  /**
   * Translates a generic request for a layer key into an Leaflet options.key and returns the result.
   * Used for methods not specific to one map library (e.g. in the GUI).
   * @param  {String|L.tileLayer.wms} layerIdentifier The identifier for the map layer we want to check,
   *                                                  or the Leaflet layer itself.
   * @param  {String}                 key             The key that we want to find the value of.
   * @return {*}                                      The value for the requested key.
   */
  _layerGet(layerIdentifier, key) {
    // Determine whether we've received a String or a tileLayer.wms
    if (typeof layerIdentifier === 'string') {
      return this._activeLayers[layerIdentifier].options[key];
    } else {
      return layerIdentifier.options[key];
    }
  }
}

/**
 * Adjust a provided OpenLayers style zoom level to be correct for Leaflet.
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
