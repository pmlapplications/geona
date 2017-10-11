/** @module map_openlayers */

import $ from 'jquery';
import GeonaMap from './map';
import {
  basemaps as defaultBasemaps, borderLayers as defaultBorders,
  latLonLabelFormatter, selectPropertyLanguage,
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
    /** @private @type {Object} The available map layers, as OpenLayers Tile layers */
    this._availableLayers = {};
    /** @private @type {Object} The map layers currently on the map, as OpenLayers Tile layers */
    this.activeLayers_ = {};
    /** @private @type {ol.Graticule} The map graticule */
    this.graticule_ = new ol.Graticule({
      showLabels: true,
      strokeStyle: new ol.style.Stroke({
        color: 'rgba(204,204,204,1)',
        width: 1,
        lineDash: [1, 4],
      }),
      latLabelFormatter: function (latitude) {
        return latLonLabelFormatter(latitude, 'N', 'S');
      },
      lonLabelFormatter: function (longitude) {
        return latLonLabelFormatter(longitude, 'E', 'W');
      },
    });
    /** @private @type {Boolean} Tracks whether the map has been initialized */
    this._initialized = false;

    /** @private @type {ol.Map} The OpenLayers map */
    this.map_ = new ol.Map({
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

    this._loadBasemaps();
    this._loadCountryBorderLayers();
    // this.loadLayers_();

    this.addLayer(this._availableLayers['terrain-light'], 'basemap');
    this.addLayer(this._availableLayers.line_black, 'borders');
    // this.map_.addLayer(this._availableLayers['terrain-light']);
    // this.activeLayers_['terrain-light'] = this._availableLayers['terrain-light'];
    // this.map_.addLayer(this._availableLayers.line_black);
    // this.activeLayers_.line_black = this._availableLayers.line_black;

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
      this.graticule_.setMap(this.map_);
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
      for (let currentLayer of this.map_.getLayers().getArray()) {
        if (currentLayer.get('modifier') === 'basemap') {
          console.log('match');
          this.map_.removeLayer(currentLayer);
        }
      }
      this.config.basemap = 'none';
    }
    if (layer !== undefined && !layer.get('projections').includes(this.map_.getView().getProjection().getCode())) {
      this.setProjection(layer.get('projections')[0]);
    }
  }

  /**
   * Clear the country borders if active
   */
  _clearBorders() {
    if (this._initialized === true && this.config.countryBorders !== 'none') {
      // Removes the top-most layer (borders will always be on top)
      this.map_.removeLayer(this.map_.getLayers().item(this.map_.getLayers().getLength() - 1));
    }
    this.config.countryBorders = 'none';
  }

  /**
   * Set the projection, if supported by the current basemap.
   * @param {String} projection The projection to use, such as 'EPSG:4326'
   */
  setProjection(projection) {
    if (this.config.basemap !== 'none') {
      let basemapId = this.map_.getLayers().item(0).get('identifier');
      // If basemap supports new projection, we can change the view
      if (this._availableLayers[basemapId].projections.includes(projection)) {
        this.setView({ projection: projection });
      } else {
        alert('Basemap ' + this.map_.getLayers().item(0).get('title') + ' does not support projection type ' + projection + '. Please select a different basemap.');
      }
    } else {
      this.setView({ projection: projection });
    }

    this.config.projection = projection;
  }

  /**
   * Moves the layer to the specified index, and reorders the other map layers where required.
   * Displaced layers move downwards when reordered.
   * @param {String}  layerName The name of the layer to be moved.
   * @param {Integer} index The zero-based index to insert the layer at. Higher values for higher layers.
   */
  reorderLayers(layerName, index) {
    let layer;
    for (let currentLayer of this.map_.getLayers().getArray()) {
      // TODO check
      if (currentLayer.get('identifier') === layerName) {
        layer = currentLayer;
      }
    }
    if (layer !== undefined) {
      for (let currentLayer of this.map_.getLayers().getArray()) {
        if (currentLayer.get('zIndex') <= index) {
          // Leaflet layers use higher values for higher positioning.
          let currentZIndex = currentLayer.get('zIndex');
          currentLayer.set('zIndex', currentZIndex -= 1);
        }
      }
      layer.set('zIndex', index);
    } else {
      alert('Layer ' + layerName + ' does not exist on the map.');
    }
  }

  /**
   * Add the specified data layer onto the map.
   * @param {Layer}   geonaLayer The Layer object to be created on the map.
   * @param {String}  [modifier] An optional String used to indicate that a layer is 'basemap' or 'borders'
   */
  addLayer(geonaLayer, modifier = undefined) {
    if (geonaLayer.projections.includes(this.map_.getView().getProjection().getCode())) {
      let source;
      let title;
      let time;
      let requiredLayer;
      let format;
      let projection;
      switch (geonaLayer.PROTOCOL) {
        case 'wms':
          title = geonaLayer.title.und;
          if (geonaLayer.isTemporal === true) {
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
          if (geonaLayer.projections.includes(this.map_.getView().getProjection().getCode())) {
            projection = this.map_.getView().getProjection().getCode();
          } else {
            projection = geonaLayer.projections[0];
          }
          source = new ol.source.TileWMS({
            url: geonaLayer.layerServer.url,
            projection: projection,
            crossOrigin: null,
            params: {
              LAYERS: requiredLayer,
              FORMAT: geonaLayer.formats || 'image/png',
              STYLES: geonaLayer.styles || 'boxfill/alg',
              // TODO update once isTemporal, firstTime and lastTime are working
              time: '2015-12-27T00:00:00.000Z',
              wrapDateLine: true,
              NUMCOLORBANDS: 255,
              VERSION: geonaLayer.layerServer.version,
            },
          });
          if (geonaLayer.attribution) {
            if (geonaLayer.attribution.onlineResource) {
              source.attributions = '<a href="' + geonaLayer.attribution.onlineResource + '">' + geonaLayer.attribution.title + '</a>';
            } else {
              source.attributions = geonaLayer.attribution.title;
            }
          }
          break;
        case 'wmts': {
          title = selectPropertyLanguage(geonaLayer.title);
          source = wmtsSourceFromLayer(geonaLayer, this.map_.getView().getProjection().getCode());
          break;
        }
        case 'osm':
          source = new ol.source.OSM({
            crossOrigin: null,
          });
          break;
      }

      this.activeLayers_[geonaLayer.identifier] = new ol.layer.Tile({
        identifier: geonaLayer.identifier,
        viewSettings: geonaLayer.viewSettings,
        projections: geonaLayer.projections,
        source: source,
        modifier: modifier,
      });
      let layer = this.activeLayers_[geonaLayer.identifier];

      // If the map layer is a unique type, we clear the old layer for that type before we add the new one.
      if (modifier === 'basemap') {
        this._clearBasemap(layer);
      } else if (modifier === 'borders') {
        this._clearBorders(layer);
      }

      this.map_.addLayer(layer);

      if (modifier === 'basemap') {
        this.reorderLayers(geonaLayer.identifier, 0);
        this.config.basemap = geonaLayer.identifier;
      } else if (modifier === 'borders') {
        this.config.countryBorders = geonaLayer.identifier;
      }

      // We always want the country borders to be on top, so we reorder them to the top each time we add a layer.
      if (this.config.countryBorders !== 'none' && this._initialized === true) {
        this.reorderLayers(this.config.countryBorders, this.map_.getLayers().getArray().length);
      }
    } else {
      alert('This layer cannot be displayed with the current ' + this.map_.getView().getProjection().getCode() + ' map projection.');
    }
  }

  /**
   * Remove the specified data layer from the map
   * @param {*} layerId The id of the data layer being removed
   */
  removeLayer(layerId) {
    if (this.map_.getLayers().getArray().includes(this.activeLayers_[layerId])) {
      this.map_.removeLayer(this.activeLayers_[layerId]);
      if(this.activeLayers_[layerId].get('modifier') === 'basemap'){
        this.config.basemap = 'none';
      } else if (this.activeLayers_[layerId].get('modifier') === 'borders') {
        this.config.countryBorders = 'none';
      }
    }
  }

  /**
   * Makes an invisible layer visible
   * @param {*} layerId The id of the data layer being made visible
   */
  showLayer(layerId) {
    this.activeLayers_[layerId].setVisible(true);
  }

  /**
   * Makes a layer invisible, but keeps it on the map
   * @param {*} layerId The id of the data layer being made hidden
   */
  hideLayer(layerId) {
    this.activeLayers_[layerId].setVisible(false);
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
    let currentCenterLatLon = ol.proj.toLonLat(this.map_.getView().getCenter(), this.map_.getView().getProjection()
      .getCode()).reverse();
    let center = options.center || { lat: currentCenterLatLon[0], lon: currentCenterLatLon[1] };
    let fitExtent = options.fitExtent;
    let maxExtent = options.maxExtent || this.config.viewSettings.maxExtent;
    let maxZoom = options.maxZoom || this.map_.getView().getMaxZoom();
    let minZoom = options.minZoom || this.map_.getView().getMinZoom();
    let projection = options.projection || this.map_.getView().getProjection().getCode();
    let zoom = options.zoom || this.map_.getView().getZoom();

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

    this.map_.setView(newView);

    // Fit the map in the fitExtent
    if (fitExtent) {
      this.map_.getView().fit(fitExtent, ol.extent.getSize(fitExtent));
      if (this.map_.getView().getZoom() < minZoom || this.map_.getView().getZoom() > maxZoom) {
        this.map_.getView().setZoom(zoom);
        this.map_.getView().setCenter(center);
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
    mapJs.onload = function () {
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
 * @param  {String}         mapProjection The current map projection, e.g. 'EPSG:4326'
 * @return {ol.source.WMTS}               A new openlayers WMTS source
 */
function wmtsSourceFromLayer(layer, mapProjection) {
  let tileMatrixSetId;

  // TODO check correct - Replace with thing to search for TileMatrixSet that supports the current projection
  // TODO change parser to make any objects with the id as the key changed to arrays with the id as a property :(

  // TODO matrixLimits (get to pass through to wmtsTileGridFromMatrixSet)
  let matrixLimits;
  for (let tileMatrixSet of Object.keys(layer.layerServer.tileMatrixSets)) {
    for (let tileMatrixSetLink of layer.tileMatrixSetLinks) {
      // If the TileMatrixSet is one of the links for the current layer and the current map projection is
      // supported, we can use this tileMatrixSet for the layer.
      if (tileMatrixSet === tileMatrixSetLink.tileMatrixSet) {
        matrixLimits = tileMatrixSetLink.tileMatrixLimits;
        if (layer.layerServer.tileMatrixSets[tileMatrixSet].projection === mapProjection) {
          tileMatrixSetId = tileMatrixSet;
        }
      }
    }
  }

  // Get the tileMatrixSet object from the layer server
  let tileMatrixSet = layer.layerServer.tileMatrixSets[tileMatrixSetId];

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
  // TODO these four ifs can probably be removed - check that WMTS layers work before and after removing
  if (isNaN(extent[0])) {
    extent[0] = Number.NEGATIVE_INFINITY;
  }
  if (isNaN(extent[1])) {
    extent[1] = Number.NEGATIVE_INFINITY;
  }
  if (isNaN(extent[2])) {
    extent[2] = Number.POSITIVE_INFINITY;
  }
  if (isNaN(extent[3])) {
    extent[3] = Number.POSITIVE_INFINITY;
  }

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
  if (layer.layerServer.operationsMetadata) {
    if (layer.layerServer.operationsMetadata.GetTile) {
      // If we can use a GET operation we use it instead of a POST.
      if (layer.layerServer.operationsMetadata.GetTile.get !== undefined) {
        let getTile = layer.layerServer.operationsMetadata.GetTile.get;
        requestEncoding = 'KVP';
        for (let tile of getTile) {
          for (let encoding of tile.encoding) {
            if (encoding === requestEncoding) {
              urls.push(tile.url);
            }
          }
        }
      } else {
        let postTile = layer.layerServer.operationsMetadata.GetTile.post;
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
  matrixSet.tileMatrices.sort(function (a, b) {
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
