/** @module map_openlayers */

import $ from 'jquery';
import GeonaMap from './map';
import {
  loadDefaultLayersAndLayerServers, latLonLabelFormatter, selectPropertyLanguage, findNearestValidTime,
} from './map_common';

import proj4 from 'proj4';

// Lines below used for ol.debug
// import openlayers from 'openlayers/dist/ol-debug';
// let ol = openlayers;

let ol;

/**
 * Class for an OpenLayers map.
 *
 * @implements {GeonaMap}
 */
export class OlMap extends GeonaMap {
  /**
   * Instantiate a new OlMap and create a new OpenLayers map.
   * @param  {Object} config The map config to load
   * @param {HTMLElement} mapDiv The div to put the map in
   */
  constructor(config, mapDiv) {
    super();
    /** @type {Object} The map config */
    this.config = config;
    /** @private @type {Object} The available basemaps, as OpenLayers Tile layers */
    this.basemaps_ = {};
    /** @private @type {Object} The available map Layers, as Geona Layers */
    this._availableLayers = {};
    /** @private @type {Object} The available map LayerServers, as Geona LayerServers */
    this._availableLayerServers = {};
    /** @private @type {Object} The map layers currently on the map, as OpenLayers Tile layers */
    this._activeLayers = {};
    /** @private @type {String} The latest time that the active map layers are set to */
    this._mapTime = undefined;
    /** @private @type {ol.Graticule} The map graticule */
    this.graticule_ = new ol.Graticule({
      showLabels: true,
      strokeStyle: new ol.style.Stroke({
        color: 'rgba(204,204,204,1)',
        width: 1,
        lineDash: [1, 4],
      }),
      latLabelFormatter: function(latitude) {
        return latLonLabelFormatter(latitude, 'N', 'S');
      },
      lonLabelFormatter: function(longitude) {
        return latLonLabelFormatter(longitude, 'E', 'W');
      },
    });
    /** @private @type {Boolean} Tracks whether the map has been initialized */
    this._initialized = false;

    /** @private @type {ol.Map} The OpenLayers map */
    this._map = new ol.Map({
      view: new ol.View(
        {
          center: [this.config.viewSettings.center.lat, this.config.viewSettings.center.lon],
          extent: [
            this.config.viewSettings.maxExtent.minLat, this.config.viewSettings.maxExtent.minLon,
            this.config.viewSettings.maxExtent.maxLat, this.config.viewSettings.maxExtent.maxLon,
          ],
          maxZoom: this.config.viewSettings.maxZoom,
          minZoom: this.config.viewSettings.minZoom,
          projection: this.config.projection,
          zoom: this.config.viewSettings.zoom,
        }),
      target: mapDiv,
      controls: [
        new ol.control.Zoom({
          zoomInLabel: $('<span class="icon-zoom-in"></span>')[0],
          zoomOutLabel: $('<span class="icon-zoom-out"></span>')[0],
        }),

        new ol.control.FullScreen({
          label: $('<span class="icon-scale-spread-2"><span>')[0],
          labelActive: $('<span class="icon-scale-reduce-1"><span>')[0],
          source: mapDiv.parentElement,
        }),

        new ol.control.Attribution({
          collapsible: true,
          collapsed: false,
        }),

        new ol.control.ScaleLine({}),
      ],
    });

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
    if (this.config.borders.identifier !== 'none' && this.config.borders !== undefined) {
      let layer = this._availableLayers[this.config.borders.identifier];
      let layerServer = this._availableLayerServers[layer.layerServer];
      this.addLayer(layer, layerServer, {modifier: 'borders', requestedStyle: this.config.borders.style});
    }

    this.loadConfig_();

    // Must come last in the method
    this._initialized = true;

    // wms
    // https://rsg.pml.ac.uk/thredds/wms/CCI_ALL-v3.0-5DAY?service=WMS&request=GetCapabilities
    // $.ajax('http://127.0.0.1:7890/utils/wms/getLayers/https%3A%2F%2Frsg.pml.ac.uk%2Fthredds%2Fwms%2FCCI_ALL-v3.0-5DAY%3Fservice%3DWMS%26request%3DGetCapabilities')
    //   .done((serverConfig) => {
    //     let keepingEslintHappy = new LayerServer(serverConfig);
    //   });

    // ----------------------------------------------------------------------------------------------

    // // wmts 3857 - success
    // http://www.ngi.be/cartoweb/1.0.0/WMTSCapabilities.xml
    // $.ajax('http://127.0.0.1:7890/utils/wmts/getLayers/http%3A%2F%2Fwww.ngi.be%2Fcartoweb%2F1.0.0%2FWMTSCapabilities.xml')
    //   .done((serverConfig) => {
    //     let keepingEslintHappy = new LayerServerWmts(serverConfig);
    //   });

    // // wmts 4326 - error
    // $.ajax('http://127.0.0.1:7890/utils/wmts/getLayers/https%3A%2F%2Ftiles.maps.eox.at%2Fwmts%2F%3FSERVICE%3DWMTS%26REQUEST%3DGetCapabilities')
    //   .done((serverConfig) => {
    //     let keepingEslintHappy = new LayerServerWmts(serverConfig);
    //   });

    // // wmts 3857 - success
    // $.ajax('http://127.0.0.1:7890/utils/wmts/getLayers/http%3A%2F%2Fsampleserver6.arcgisonline.com%2Farcgis%2Frest%2Fservices%2FWorldTimeZones%2FMapServer%2FWMTS%3Fservice%3DWMTS%26version%3D1.0.0%26request%3Dgetcapabilities')
    //   .done((serverConfig) => {
    //     let keepingEslintHappy = new LayerServerWmts(serverConfig);
    //   });

    // // wmts 3857 - success
    // $.ajax('http://127.0.0.1:7890/utils/wmts/getLayers/https%3A%2F%2Flabs.koordinates.com%2Fservices%3Bkey%3Dd740ea02e0c44cafb70dce31a774ca10%2Fwmts%2F1.0.0%2Flayer%2F7328%2FWMTSCapabilities.xml')
    //   .done((serverConfig) => {
    //     let keepingEslintHappy = new LayerServerWmts(serverConfig);
    //   });

    // // wmts 4326 - success
    // $.ajax('http://127.0.0.1:7890/utils/wmts/getLayers/https%3A%2F%2Fgibs.earthdata.nasa.gov%2Fwmts%2Fepsg4326%2Fbest%2Fwmts.cgi%3FVERSION%3D1.0.0%26Request%3DGetCapabilities%26Service%3DWMTS')
    //   .done((serverConfig) => {
    //     let keepingEslintHappy = new LayerServerWmts(serverConfig);
    //   });

    // // WMTS 3857 - success
    // $.ajax('http://127.0.0.1:7890/utils/wmts/getLayers/http%3A%2F%2Fviewer.globalland.vgt.vito.be%2Fmapcache%2Fwmts%3Fservice%3DWMTS%26request%3DGetCapabilities')
    //   .done((serverConfig) => {
    //     let keepingEslintHappy = new LayerServerWmts(serverConfig);
    //   });

    // $.ajax('https://openlayers.org/en/v4.3.2/examples/data/WMTSCapabilities.xml')
    //   .done((text) => {
    //     let parser = new ol.format.WMTSCapabilities();
    //     let result = parser.read(text);
    //     let wmtsOptions = ol.source.WMTS.optionsFromCapabilities(result, {
    //       layer: 'layer-7328',
    //       matrixSet: 'EPSG:3857',
    //     });
    //   });
  }

  /**
   * Set the graticule as visible or not.
   * @param  {Boolean} display True to display graticule
   */
  displayGraticule(display) {
    if (display) {
      this.graticule_.setMap(this._map);
      this.config.graticule = true;
    } else {
      this.graticule_.setMap();
      this.config.graticule = false;
    }
  }

  /**
   * Clears the basemap ready for a new one, changing the projection if required.
   * @param {ol.Layer.Tile} [layer] Optional layer created in addLayer(), used for setting a new projection
   */
  _clearBasemap(layer = undefined) {
    if (this._initialized === true && this.config.basemap !== 'none') {
      for (let currentLayer of this._map.getLayers().getArray()) {
        if (currentLayer.get('modifier') === 'basemap') {
          this.removeLayer(currentLayer.get('identifier'));
        }
      }
      this.config.basemap = 'none';
    }
    if (layer !== undefined && !layer.get('projections').includes(this._map.getView().getProjection().getCode())) {
      this.setProjection(layer.get('projections')[0]);
    }
  }

  /**
   * Clear the country borders if active
   */
  _clearBorders() {
    if (this._initialized === true && this.config.borders !== 'none') {
      // Removes the top-most layer (borders will always be on top)
      for (let currentLayer of this._map.getLayers().getArray()) {
        if (currentLayer.get('modifier') === 'borders') {
          this.removeLayer(currentLayer.get('identifier'));
        }
      }
      // this.removeLayer(this._map.getLayers().item(this._map.getLayers().getLength() - 1).get('identifier'));
    }
    this.config.borders = 'none';
  }

  /**
   * Set the projection, if supported by the current basemap.
   * @param  {String}  projection The projection to use, such as 'EPSG:4326'.
   * @return {String}             The new map projection.
   */
  setProjection(projection) {
    if (this.config.basemap !== 'none') {
      let basemapId = this._map.getLayers().item(0).get('identifier');
      // If basemap supports new projection, we can change the view
      if (this._availableLayers[basemapId].projections.includes(projection)) {
        this.setView({projection: projection});
        this.config.projection = projection;
        return projection;
      } else {
        alert('Basemap ' + this._map.getLayers().item(0).get('identifier') + ' does not support projection type ' + projection + '. Please select a different basemap.');
        return this._map.getView().getProjection().getCode();
      }
    } else {
      this.setView({projection: projection});
      this.config.projection = projection;
      return projection;
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
    let currentCenterLatLon = ol.proj.toLonLat(this._map.getView().getCenter(), this._map.getView().getProjection()
      .getCode()).reverse();
    let center = options.center || {lat: currentCenterLatLon[0], lon: currentCenterLatLon[1]};
    let fitExtent = options.fitExtent;
    let maxExtent = options.maxExtent || this.config.viewSettings.maxExtent;
    let maxZoom = options.maxZoom || this._map.getView().getMaxZoom();
    let minZoom = options.minZoom || this._map.getView().getMinZoom();
    let projection = options.projection || this._map.getView().getProjection().getCode();
    let zoom = options.zoom || this._map.getView().getZoom();

    this.config.projection = projection;
    this.config.viewSettings.center = center;
    this.config.viewSettings.maxExtent = maxExtent;
    this.config.viewSettings.maxZoom = maxZoom;
    this.config.viewSettings.minZoom = minZoom;
    this.config.viewSettings.zoom = zoom;

    // Converts the min and max coordinates from LatLon to current projection
    maxExtent = ol.proj.fromLonLat([maxExtent.minLon, maxExtent.minLat], projection)
      .concat(ol.proj.fromLonLat([maxExtent.maxLon, maxExtent.maxLat], projection));

    if (fitExtent) {
      fitExtent = ol.proj.fromLonLat([fitExtent.minLon, fitExtent.minLat], projection)
        .concat(ol.proj.fromLonLat([fitExtent.maxLon, fitExtent.maxLat], projection));
    }
    center = ol.proj.fromLonLat([center.lon, center.lat], projection);

    // Ensure that the center is within the maxExtent
    if (maxExtent && !ol.extent.containsCoordinate(maxExtent, center)) {
      center = ol.extent.getCenter(maxExtent);
    }

    let newView = new ol.View({
      center: center,
      extent: maxExtent,
      maxZoom: maxZoom,
      minZoom: minZoom,
      projection: projection,
      zoom: zoom,
    });

    this._map.setView(newView);

    // Fit the map in the fitExtent
    if (fitExtent) {
      this._map.getView().fit(fitExtent, ol.extent.getSize(fitExtent));
      if (this._map.getView().getZoom() < minZoom || this._map.getView().getZoom() > maxZoom) {
        this._map.getView().setZoom(zoom);
        this._map.getView().setCenter(center);
      }
    }
  }

  /**
   * Add the specified data layer onto the map, using the specified options.
   * Will also add a Geona layer to the_availableLayers if not already included (same goes for the LayerServer).
   *
   * @param {Layer}       geonaLayer       The Geona Layer object to be created as an OpenLayers layer on the map.
   * @param {LayerServer} geonaLayerServer The Geona LayerServer object that corresponds to the Geona Layer.
   * @param {Object}      [options]        A list of options that affect the layers being added
   *   @param {String}  options.modifier       Indicates that a layer is 'basemap', 'borders' or 'hasTime'.
   *   @param {String}  options.requestedTime  The time requested for this layer.
   *   @param {String}  options.requestedStyle The identifier of the style requested for this layer.
   *   @param {Boolean} options.shown          Whether to show or hide the layer when it is first put on the map.
   */
  addLayer(geonaLayer, geonaLayerServer, options = {modifier: undefined, requestedTime: undefined, requestedStyle: undefined, shown: true}) {
    // TODO try and clean this method up - maybe split it up into separate methods.
    // Maybe have a wmsSourceFromLayer() for the list of options?
    // Also the bit at the end where modifiers are checked and reordering happens needs tidied.

    // Set default options if not specified
    // No need to set modifier and requestedTime
    if (options.shown === undefined) {
      options.shown = true;
    }

    // Checks the map for any layers with the same identifier as the layer being added
    let duplicate = false;
    for (let layer of this._map.getLayers().getArray()) {
      if (layer.get('identifier') === geonaLayer.identifier) {
        duplicate = true;
      }
    }
    // We enforce that identifiers must be unique on the map.
    // TODO offer option of changing identifier.
    if (duplicate === true) {
      alert('Layer with the identifier ' + geonaLayer.identifier + ' already exists on the map.');
    } else if (!geonaLayer.projections.includes(this._map.getView().getProjection().getCode())) {
      alert('This layer cannot be displayed with the current ' + this._map.getView().getProjection().getCode() + ' map projection.');
    } else {
      let attributions;
      let format;
      let projection;
      let requiredLayer;
      let source;
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

          // Select appropriate projection - at this stage of the method, only basemaps might have different projections.
          if (geonaLayer.projections.includes(this._map.getView().getProjection().getCode())) {
            projection = this._map.getView().getProjection().getCode();
          } else {
            projection = geonaLayer.projections[0];
          }

          if (geonaLayer.attribution) {
            if (geonaLayer.attribution.onlineResource) {
              // attributions = '<a href="' + geonaLayer.attribution.onlineResource + '">' + geonaLayer.attribution.title + '</a>';
              attributions = geonaLayer.attribution.onlineResource;
            } else {
              attributions = geonaLayer.attribution.title;
            }
          }
          // FIXME A not-very-good way of adding the Geona prefix to attributions in OpenLayers
          // Not good because 'Geona' won't be displayed without any layers, if the layer it's attached to is
          // removed, and will be out of sequence if the layers are added in different orders
          if (this._map.getLayers().getArray().length === 0 || options.modifier === 'basemap') {
            attributions = 'Geona | ' + attributions;
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

          source = new ol.source.TileWMS({
            url: geonaLayerServer.url,
            projection: projection,
            attributions: attributions,
            crossOrigin: null,
            params: {
              LAYERS: requiredLayer,
              FORMAT: geonaLayer.formats || 'image/png',
              STYLES: style || '',
              time: time,
              wrapDateLine: true,
              NUMCOLORBANDS: 255,
              VERSION: geonaLayerServer.version,
            },
          });
          break;
        case 'wmts': {
          title = selectPropertyLanguage(geonaLayer.title);
          source = wmtsSourceFromLayer(geonaLayer, this._map.getView().getProjection().getCode());
          break;
        }
        case 'osm':
          source = new ol.source.OSM({
            crossOrigin: null,
          });
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

      this._activeLayers[geonaLayer.identifier] = new ol.layer.Tile({
        identifier: geonaLayer.identifier,
        viewSettings: geonaLayer.viewSettings,
        projections: geonaLayer.projections,
        source: source,
        modifier: options.modifier,
        // The zIndex is set to the length here, rather than the length - 1 as with most 0-based indices.
        // This is to compensate for the fact that the layer has not been added to the map yet.
        zIndex: this._map.getLayers().getArray().length,
        layerTime: time,
        shown: options.shown,
        timeHidden: false,
      });
      let layer = this._activeLayers[geonaLayer.identifier];

      // If the map layer is a unique type, we clear the old layer for that type before we add the new one.
      if (options.modifier === 'basemap') {
        // FIXME this probably won't work
        this._clearBasemap(layer);
      } else if (options.modifier === 'borders') {
        // FIXME this probably won't work
        this._clearBorders(layer);
      }

      // Sets the map time if this is the first layer
      if (this._mapTime === undefined && time !== undefined) {
        this._mapTime = time;
      }

      this._map.addLayer(layer);

      if (options.shown === false) {
        layer.setVisible(false);
      }

      if (options.modifier === 'basemap') {
        this.reorderLayers(geonaLayer.identifier, 0);
        this.config.basemap = geonaLayer.identifier;
      } else if (options.modifier === 'borders') {
        this.config.borders = geonaLayer.identifier;
      } else if (this._initialized === true) {
        this.config.data.push(geonaLayer.identifier);
      }

      // We always want the country borders to be on top, so we reorder them to the top each time we add a layer.
      if (this.config.borders !== 'none' && this._initialized === true) {
        this.reorderLayers(this.config.borders, this._map.getLayers().getArray().length - 1);
      }
    }
  }

  /**
   * Remove the specified data layer from the map
   * @param {String} layerIdentifier The id of the data layer being removed
   */
  removeLayer(layerIdentifier) {
    if (this._map.getLayers().getArray().includes(this._activeLayers[layerIdentifier])) {
      this._map.removeLayer(this._activeLayers[layerIdentifier]);
      if (this._activeLayers[layerIdentifier].get('modifier') === 'basemap') {
        this.config.basemap = 'none';
        // As we have removed the basemap, the zIndices should all be reduced by 1.
        for (let layer of this._map.getLayers().getArray()) {
          layer.set('zIndex', layer.get('zIndex') - 1);
        }
      } else if (this._activeLayers[layerIdentifier].get('modifier') === 'borders') {
        this.config.borders = 'none';
      } else {
        // We removed a data layer, so the layers above the removed layer should have their zIndex reduced by 1.
        let zIndex = this._activeLayers[layerIdentifier].get('zIndex');
        for (let layer of this._map.getLayers().getArray()) {
          if (layer.get('zIndex') > zIndex) {
            layer.set('zIndex', layer.get('zIndex') - 1);
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
      for (let layer of this._map.getLayers().getArray()) {
        if (layer.get('modifier') === 'hasTime') {
          dataLayersCounter++;
        }
      }
      if (dataLayersCounter === 0) {
        this._mapTime = undefined;
      }
      delete this._activeLayers[layerIdentifier];
    }
  }

  /**
   * Makes an invisible layer visible
   * @param {String} layerIdentifier The id of the data layer being made visible
   */
  showLayer(layerIdentifier) {
    if (this._activeLayers[layerIdentifier] !== undefined) {
      if (this._activeLayers[layerIdentifier].get('timeHidden') === false) {
        this._activeLayers[layerIdentifier].setVisible(true);
      }
      this._activeLayers[layerIdentifier].set('shown', true);
    }
  }

  /**
   * Makes a layer invisible, but keeps it on the map
   * @param {String} layerIdentifier The id of the data layer being made hidden
   */
  hideLayer(layerIdentifier) {
    if (this._activeLayers[layerIdentifier] !== undefined) {
      this._activeLayers[layerIdentifier].setVisible(false);
      this._activeLayers[layerIdentifier].set('shown', false);
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
   * For example, with a basemap, a data layer, and a country borders layer, the zIndex values would be
   * 0, 1, 2, in that order.
   *
   * @param {String}  layerIdentifier The identifier of the layer to be moved.
   * @param {Integer} targetIndex The zero-based index to insert the layer at. Higher values for higher layers.
   */
  reorderLayers(layerIdentifier, targetIndex) {
    let layer;
    let layerModifier = this._activeLayers[layerIdentifier].get('modifier');
    let maxZIndex = this._map.getLayers().getArray().length - 1;

    if (this.config.basemap !== 'none' && targetIndex <= 0 && layerModifier !== 'basemap' && this._initialized === true) {
      // There is an active basemap, which must stay at index 0. 0 is the lowest sane index allowed.
      throw new Error('Attempt was made to move data layer below basemap. Basemaps must always be at position 0.');
    } else if (this.config.basemap === 'none' && targetIndex < 0 && this._initialized === true) {
      // There is no basemap, but the lowest allowed index is 0.
      throw new Error('Attempt was made to move layer below 0. The lowest layer must always be at position 0.');
    } else if (this.config.borders !== 'none' && targetIndex >= maxZIndex && layerModifier !== 'borders' && this._initialized === true) {
      // There is a borders layer, which must stay one position above the rest of the layers.
      throw new Error('Attempt was made to move data layer above borders. Borders must always be at the highest position.');
    } else if (this.config.borders === 'none' && targetIndex > maxZIndex && this._initialized === true) {
      // There is no borders layer, but the index is higher than the number of layers - 1.
      throw new Error('Attempt was made to move layer above the highest sane zIndex. The highest layer must always be one position above the rest.');
    } else {
      for (let currentLayer of this._map.getLayers().getArray()) {
        if (currentLayer.get('identifier') === layerIdentifier) {
          layer = currentLayer;
        }
      }
      if (layer !== undefined) {
        if (layer.get('zIndex') < targetIndex) {
          // We are moving the layer up
          for (let currentLayer of this._map.getLayers().getArray()) {
            if (currentLayer.get('zIndex') <= targetIndex && currentLayer.get('zIndex') > layer.get('zIndex')) {
              // Layers use higher values for higher positioning.
              let currentZIndex = currentLayer.get('zIndex');
              currentLayer.set('zIndex', currentZIndex - 1);
            }
          }
        } else if (layer.get('zIndex') > targetIndex) {
          // We are moving the layer down
          for (let currentLayer of this._map.getLayers().getArray()) {
            if (currentLayer.get('zIndex') >= targetIndex && currentLayer.get('zIndex') < layer.get('zIndex')) {
              // Layers use higher values for higher positioning.
              let currentZIndex = currentLayer.get('zIndex');
              currentLayer.set('zIndex', currentZIndex + 1);
            }
          }
        }
        layer.set('zIndex', targetIndex);
      } else {
        alert('Layer ' + layerIdentifier + ' does not exist on the map.');
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
    } else if (this._activeLayers[layerIdentifier].get('modifier') !== 'hasTime') {
      let modifier = this._activeLayers[layerIdentifier].get('modifier');
      throw new Error('Cannot change the time of a ' + modifier + ' layer.');
    } else {
      // We find the nearest, past valid time for this layer
      let time = findNearestValidTime(geonaLayer, requestedTime);
      if (time === undefined) {
        // If the requested time is invalid for the layer, we hide the layer
        // We don't use the hideLayer() method because we don't want to update the state of the 'shown' option
        this._activeLayers[layerIdentifier].setVisible(false);
        this._activeLayers[layerIdentifier].set('timeHidden', true);
        // We also set the map time to be the requestedTime, so when we sort below we have an early starting point.
        this._mapTime = requestedTime;
      } else {
        // We save the zIndex so we can reorder the layer to it's current position when we re-add it
        let zIndex = this._activeLayers[layerIdentifier].get('zIndex');
        // We define the layer options so that only the time changes
        let layerOptions = {
          modifier: 'hasTime',
          requestedStyle: this._activeLayers[layerIdentifier].get('source').getParams().STYLES,
          // We save the layer's 'shown' value so the layer's state of visibility is kept upon changing time
          shown: this._activeLayers[layerIdentifier].get('shown'),
          requestedTime: time,
        };

        this.removeLayer(layerIdentifier);
        let geonaLayerServer = this._availableLayerServers[geonaLayer.layerServer];
        this.addLayer(geonaLayer, geonaLayerServer, layerOptions);
        this.reorderLayers(layerIdentifier, zIndex);
        this._activeLayers[layerIdentifier].set('timeHidden', false);

        // We also set the map time to be the new layer time, so when we sort below we will have a valid starting point.
        this._mapTime = time;
      }

      // We now find the latest map time.
      let mapTime = new Date(this._mapTime);

      // We compare the map data layers to find the latest time for the visible data layers
      for (let layer of this._map.getLayers().getArray()) {
        // We check for visibility so that the map time will be the requested time if all layers are hidden
        if (layer.get('modifier') === 'hasTime' && layer.getVisible() === true) {
          let layerTime = new Date(layer.get('layerTime'));
          if (layerTime > mapTime) {
            this._mapTime = layer.get('layerTime');
            mapTime = new Date(layer.get('layerTime'));
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
      if (this._activeLayers[layerIdentifier].get('modifier') === 'hasTime') {
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
            modifier: layer.get('modifier'),
            requestedTime: layer.get('layerTime'),
            shown: layer.get('shown'),
            requestedStyle: styleIdentifier,
          };
          // Save the z-index so the layer remains in position
          let zIndex = layer.get('zIndex');

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
   * Translates a generic request for a layer key into an OpenLayers get() and returns the result.
   * Used for methods not specific to one map library (e.g. in the GUI).
   * @param  {String|ol.layer.Tile} layerIdentifier The identifier for the map layer we want to check,
   *                                                or the OpenLayers layer itself.
   * @param  {String}               key             The key that we want to find the value of.
   * @return {*}                                    The value for the requested key.
   */
  _layerGet(layerIdentifier, key) {
    // Determine whether we've received a String or a Layer.Tile
    if (typeof layerIdentifier === 'string') {
      return this._activeLayers[layerIdentifier].get(key);
    } else {
      return layerIdentifier.get(key);
    }
  }
}

/**
 * Load the openlayers js library and dynamically import it.
 * @param {String}   geonaServer URL of the server Geona is running on.
 * @param {Function} next
 */
export function init(geonaServer, next) {
  if (ol) {
    // If ol has already been loaded
    next();
  } else {
    let head = document.getElementsByTagName('head')[0];
    let mapJs = document.createElement('script');
    mapJs.onload = function() {
      import('openlayers')
        .then((olLib) => {
          ol = olLib;
          next();
        });
    };

    mapJs.src = geonaServer + '/js/vendor_openlayers.js';
    head.appendChild(mapJs);
  }
}

/**
 * Create an openlayers WMTS source from a Geona Layer.
 * Adapted from https://github.com/openlayers/openlayers/blob/v4.3.2/src/ol/source/wmts.js#L299
 * @param  {Layer}          layer         The Geona layer
 * @param  {LayerServer}    layerServer   The corresponding LayerServer
 * @param  {String}         mapProjection The current map projection, e.g. 'EPSG:4326'
 * @return {ol.source.WMTS}               A new openlayers WMTS source
 */
function wmtsSourceFromLayer(layer, layerServer, mapProjection) {
  let tileMatrixSetId;

  // TODO check correct - Replace with thing to search for TileMatrixSet that supports the current projection

  // TODO matrixLimits (get to pass through to wmtsTileGridFromMatrixSet)
  let matrixLimits;
  for (let tileMatrixSet of Object.keys(layerServer.tileMatrixSets)) {
    for (let tileMatrixSetLink of layer.tileMatrixSetLinks) {
      // If the TileMatrixSet is one of the links for the current layer and the current map projection is
      // supported, we can use this tileMatrixSet for the layer.
      if (tileMatrixSet === tileMatrixSetLink.tileMatrixSet) {
        matrixLimits = tileMatrixSetLink.tileMatrixLimits;
        if (layerServer.tileMatrixSets[tileMatrixSet].projection === mapProjection) {
          tileMatrixSetId = tileMatrixSet;
        }
      }
    }
  }

  // Get the tileMatrixSet object from the layer server
  let tileMatrixSet = layerServer.tileMatrixSets[tileMatrixSetId];

  let format;
  if (layer.formats.includes('image/png')) {
    format = 'image/png';
  } else if (layer.formats.includes('image/jpeg')) {
    format = 'image/jpeg';
  } else {
    format = layer.formats[0];
  }

  // TODO This should pick the style provided in a config
  let style;
  let defaultStyle;
  for (let currentStyle of layer.styles) {
    if (currentStyle.isDefault === true) {
      defaultStyle = currentStyle.identifier;
    }
    style = currentStyle.identifier;
  }
  if (defaultStyle !== undefined) {
    style = defaultStyle;
  }

  let dimensions;
  if (layer.dimensions) {
    dimensions = {};
    for (let dimension of layer.dimensions) {
      // TODO if we're loading from saved map, load the time of this layer as it was saved, else...
      if (dimension.default) {
        // If there's a default value we use that.
        let id = dimension.identifier;
        let layerDimension = {};
        layerDimension[id] = dimension.default;
        Object.assign(dimensions, layerDimension);
      } else {
        // Otherwise we use the highest value
        let id = dimension.identifier;
        let layerDimension = {};
        // Pick the last one from the list after sorting.
        let sortedValues = dimension.value.sort();
        layerDimension[id] = dimension.value[dimension.value.length - 1];
        Object.assign(dimensions, layerDimension);
      }
    }
  }

  let projection = ol.proj.get(tileMatrixSet.projection);

  // Get the extent in the right projection format from the layer bounding box
  let extent;
  if (layer.boundingBox.style === 'wgs84BoundingBox') { // WGS84 will use degrees as units, and be in lon/lat
    // If the map projection is in metres (m) we need to convert the bounding box coordinates.
    if (ol.proj.get(mapProjection).getUnits() === 'm') {
      extent = ol.proj.transformExtent(
        [layer.boundingBox.minLon, layer.boundingBox.minLat, layer.boundingBox.maxLon, layer.boundingBox.maxLat],
        'EPSG:4326', mapProjection
      );
    } else {
      extent = [layer.boundingBox.minLon, layer.boundingBox.minLat, layer.boundingBox.maxLon, layer.boundingBox.maxLat];
    }
  } else if (layer.boundingBox.style === 'boundingBox') { // We have to find out what projection the bounding box is in.
    if (ol.proj.get(mapProjection).getUnits() === 'm') {
      // If the units match, we don't need to convert.
      if (ol.proj.get(layer.boundingBox.projection).getUnits() === 'm') {
        extent = [
          layer.boundingBox.minLon, layer.boundingBox.minLat,
          layer.boundingBox.maxLon, layer.boundingBox.maxLat,
        ];
      } else {
        extent = ol.proj.transformExtent(
          [layer.boundingBox.minLon, layer.boundingBox.minLat, layer.boundingBox.maxLon, layer.boundingBox.maxLat],
          layer.boundingBox.projection, mapProjection
        );
      }
    } else { // The units will be degrees
      if (ol.proj.get(layer.boundingBox.projection).getUnits() === 'degrees') {
        extent = [
          layer.boundingBox.minLon, layer.boundingBox.minLat,
          layer.boundingBox.maxLon, layer.boundingBox.maxLat,
        ];
      } else {
        extent = ol.proj.transformExtent(
          [layer.boundingBox.minLon, layer.boundingBox.minLat, layer.boundingBox.maxLon, layer.boundingBox.maxLat],
          layer.boundingBox.projection, mapProjection
        );
      }
    }
  }

  // let extent = ol.proj.transformExtent(
  //   [layer.boundingBox.minLon, layer.boundingBox.minLat, layer.boundingBox.maxLon, layer.boundingBox.maxLat],
  //   'EPSG:4326', projection
  // );

  // Not sure if wrapX should always be true. It should be fine though
  let wrapX = true;

  // Get the tile grid
  let tileGrid = wmtsTileGridFromMatrixSet(tileMatrixSet, extent, matrixLimits);

  let urls = [];
  // requestEncoding is used to track which encoding we will use to request tiles.
  let requestEncoding = '';

  // Even though operationsMetadata can contain REST encodings alongside URLs, these URLs are not the
  // templated form required for REST requests, so we only take KVP information from here. REST information
  // is taken from the resourceUrls section.
  if (layerServer.operationsMetadata) {
    if (layerServer.operationsMetadata.GetTile) {
      // If we can use a GET operation we use it instead of a POST.
      if (layerServer.operationsMetadata.GetTile.get !== undefined) {
        let getTile = layerServer.operationsMetadata.GetTile.get;
        requestEncoding = 'KVP';
        for (let tile of getTile) {
          for (let encoding of tile.encoding) {
            if (encoding === requestEncoding) {
              urls.push(tile.url);
            }
          }
        }
      } else {
        let postTile = layerServer.operationsMetadata.GetTile.post;
        requestEncoding = 'KVP';
        for (let tile of postTile) {
          for (let encoding of tile.encoding) {
            if (encoding === requestEncoding) {
              urls.push(tile.url);
            }
          }
        }
      }
    }
  }

  // If no tile urls were found in the operationsMetadata, get them from the layer resourceUrls.
  if (urls.length === 0) {
    requestEncoding = 'REST';
    for (let resource of layer.resourceUrls) {
      if (resource.resourceType === 'tile') {
        format = resource.format;
        urls.push(resource.template);
      }
    }
  }

  return new ol.source.WMTS({
    urls: urls,
    layer: layer.identifier,
    matrixSet: tileMatrixSetId,
    format: format,
    projection: projection,
    requestEncoding: requestEncoding,
    tileGrid: tileGrid,
    style: style,
    dimensions: dimensions,
    wrapX: wrapX,
    crossOrigin: null,
  });
}

/**
   * Create an openlayers WMTS Tile Grid from a provided matrix set.
   * Adapted from https://github.com/openlayers/openlayers/blob/v4.3.2/src/ol/tilegrid/wmts.js#L71
   * @param  {Object}           matrixSet    The matrix set from a LayerServerWmts
   * @param  {ol.Extent}        extent       Extent for the tile grid
   * @param  {Array}            matrixLimits The matrix limits
   * @return {ol.tilegrid.WMTS}              An openlayers WMTS tile grid
   */
function wmtsTileGridFromMatrixSet(matrixSet, extent = undefined, matrixLimits = []) {
  /** @type {!Array.<number>} */
  let resolutions = [];
  /** @type {!Array.<string>} */
  let matrixIds = [];
  /** @type {!Array.<ol.Coordinate>} */
  let origins = [];
  /** @type {!Array.<ol.Size>} */
  let tileSizes = [];
  /** @type {!Array.<ol.Size>} */
  let sizes = [];

  let projection = ol.proj.get(matrixSet.projection);
  let axisOrientation = proj4(matrixSet.projection).oProj.axis;
  let metersPerUnit = projection.getMetersPerUnit();

  // If the projection has coordinates as (y, x)/(north, east) instead of (x, y)/(east, north),
  // they will need to be switched

  let switchOriginXy = axisOrientation.substr(0, 2) === 'ne';

  // Sort the array of tileMatrices by their scaleDenominators
  matrixSet.tileMatrices.sort(function(a, b) {
    return b.scaleDenominator - a.scaleDenominator;
  });

  for (let matrix of matrixSet.tileMatrices) {
    // TODO matrix limits - https://github.com/openlayers/openlayers/blob/v4.3.2/src/ol/tilegrid/wmts.js#L109
    // let matrixAvailable;
    // if (matrixLimits.length > 0) {
    //   matrixAvailable = ol.array.find(matrixLimits,
    //     (elt_ml, index_ml, array_ml) => {
    //       return elt.identifier == elt_ml.tileMatrices;
    //     });
    // }

    matrixIds.push(matrix.identifier);
    let resolution = matrix.scaleDenominator * 0.28E-3 / metersPerUnit; // Magic
    let tileWidth = matrix.tileWidth;
    let tileHeight = matrix.tileHeight;

    if (switchOriginXy) {
      // Swap the coordinates for the top left corner if needs be
      origins.push(matrix.topLeftCorner.reverse());
    } else {
      origins.push(matrix.topLeftCorner);
    }

    resolutions.push(resolution);

    if (tileWidth === tileHeight) {
      tileSizes.push(tileWidth);
    } else {
      tileSizes.push([tileWidth, tileHeight]);
    }

    // top-left origin, so height is negative
    sizes.push([matrix.matrixWidth, -matrix.matrixHeight]);
  }

  return new ol.tilegrid.WMTS({
    extent: extent,
    origins: origins,
    resolutions: resolutions,
    matrixIds: matrixIds,
    tileSizes: tileSizes,
    sizes: sizes,
  });
}
