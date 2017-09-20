/** @module map_openlayers */

import $ from 'jquery';
import GeonaMap from './map';
import {
  basemaps as defaultBasemaps, borderLayers as defaultBorders,
  latLonLabelFormatter, selectPropertyLanguage,
} from './map_common';
import LayerServer from '../../common/layer/server/layer_server';
import LayerServerWmts from '../../common/layer/server/layer_server_wmts';

import proj4 from 'proj4';

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
    /** @private @type {Object} The available country border layers, as OpenLayers Tile layers */
    this.countryBorderLayers_ = {};
    /** @private @type {Object} The available data layers, as OpenLayers Tile layers */
    this.activeLayers_ = {};
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
    this.initialized_ = false;

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

    this.loadBasemaps_();
    this.loadCountryBorderLayers_();
    // this.loadLayers_();

    this.loadConfig_();

    // Must come last in the method
    this.initialized_ = true;

    // this.addLayer('chlor_a');
    // this.addLayer('ph_hcmr');

    // wms
    // $.ajax('http://127.0.0.1:7890/utils/wms/getLayers/https%3A%2F%2Frsg.pml.ac.uk%2Fthredds%2Fwms%2FCCI_ALL-v3.0-5DAY%3Fservice%3DWMS%26request%3DGetCapabilities')
    //   .done((serverConfig) => {
    //     let keepingEslintHappy = new LayerServer(serverConfig);
    //   });

    // wmts
    // $.ajax('http://127.0.0.1:7890/utils/wmts/getLayers/https%3A%2F%2Fmap1.vis.earthdata.nasa.gov%2Fwmts-geo%2F1.0.0%2FWMTSCapabilities.xml')
    //   .done((serverConfig) => {
    //     let keepingEslintHappy = new LayerServer(serverConfig);
    //   });

    // wmts
    $.ajax('http://127.0.0.1:7890/utils/wmts/getLayers/http%3A%2F%2Fsampleserver6.arcgisonline.com%2Farcgis%2Frest%2Fservices%2FWorldTimeZones%2FMapServer%2FWMTS%3Fservice%3DWMTS%26version%3D1.0.0%26request%3Dgetcapabilities')
      .done((serverConfig) => {
        let keepingEslintHappy = new LayerServerWmts(serverConfig);
      });

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
   * Set the basemap, changing the projection if required.
   * @param {String} basemap The id of the basemap to use, or 'none'
   */
  setBasemap(basemap) {
    if (this.initialized_ === true && this.config.basemap !== 'none') {
      this.map_.removeLayer(this.map_.getLayers().item(0));
    }

    if (basemap !== 'none') {
      if (this.basemaps_[basemap].get('projections').includes(this.map_.getView().getProjection().getCode())) {
        this.setView(this.basemaps_[basemap].get('viewSettings'));
      } else {
        let options = this.basemaps_[basemap].get('viewSettings');
        options.projection = this.basemaps_[basemap].get('projections')[0];
        this.setView(options);
      }
      // Add the new basemap after updating the view
      this.map_.getLayers().insertAt(0, this.basemaps_[basemap]);
    }
    this.config.basemap = basemap;
  }

  /**
   * Set the country borders to display.
   * @param {String} borders The borders to display, or 'none'
   */
  setCountryBorders(borders) {
    if (this.initialized_ === true && this.config.countryBorders !== 'none') {
      // Removes the top-most layer (borders will always be on top)
      this.map_.removeLayer(this.map_.getLayers().item(this.map_.getLayers().getLength() - 1));
    }

    if (borders !== 'none') {
      try {
        this.map_.addLayer(this.countryBorderLayers_[borders]);
      } catch (e) {
        // TODO handle error
        // error will have occurred because the borders have not loaded, or because the specified border does not exist.
        console.error(e);
      }
    }

    this.config.countryBorders = borders;
  }

  /**
   * Set the projection, if supported by the current basemap.
   * @param {String} projection The projection to use, such as 'EPSG:4326'
   */
  setProjection(projection) {
    if (this.config.basemap !== 'none') {
      let basemapId = this.map_.getLayers().item(0).get('id');
      // If basemap supports new projection, we can change the view
      if (this.basemaps_[basemapId].get('projections').includes(projection)) {
        this.setView({projection: projection});
      } else {
        alert('Basemap ' + this.map_.getLayers().item(0).get('title') + ' does not support projection type ' + projection + '. Please select a different basemap.');
      }
    }

    this.config.projection = projection;
  }

  /**
   * Add the specified data layer onto the map.
   * @param {Layer} geonaLayer The Layer object to be created on the map.
   * @param {Integer} [index] The zero-based index to insert the layer into.
   */
  addLayer(geonaLayer, index) {
    // TODO reinstate this if
    if (geonaLayer.projections.includes(this.map_.getView().getProjection().getCode())) {
      let source;
      let title;
      let time;
      switch (geonaLayer.PROTOCOL) {
        case 'wms':
          title = geonaLayer.title.und;
          if (geonaLayer.isTemporal === true) {
            time = geonaLayer.lastTime;
          }
          source = new ol.source.TileWMS({
            url: geonaLayer.layerServer.url,
            projection: this.map_.getView().getProjection().getCode() || geonaLayer.projections[0],
            crossOrigin: null,
            params: {
              LAYERS: geonaLayer.name,
              FORMAT: 'image/png', // TODO maybe change later
              // TODO STYLES:
              STYLES: 'boxfill/alg',
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
          source = wmtsSourceFromLayer(geonaLayer);
          // let projection = ol.proj.get('EPSG:4326');
          // let projectionExtent = projection.getExtent();
          // let size = ol.extent.getWidth(projectionExtent) / 256;
          // let resolutions = new Array(14);
          // for (let i = 0; i < 14; ++i) {
          //   resolutions[i] = size / Math.pow(2, i);
          // }
          // title = selectPropertyLanguage(geonaLayer.title);
          // source = new ol.source.WMTS({
          //   url: geonaLayer.layerServer.url,
          //   layer: '0',
          //   matrixSet: 'EPSG:4326',
          //   format: 'image/png',
          //   projection: projection,
          //   tileGrid: new ol.tilegrid.WMTS({
          //     origin: projectionExtent,
          //     resolutions: resolutions,
          //     // matrixIds: Object.getOwnPropertyNames(),
          //   }),

          // });
          // if (geonaLayer.attribution) {
          //   if (geonaLayer.attribution.onlineResource) {
          //     source.attributions = '<a href="' + geonaLayer.attribution.onlineResource + '">' + geonaLayer.attribution.title + '</a>';
          //   } else {
          //     source.attributions = geonaLayer.attribution.title;
          //   }
          // }
          break;
        }
        case 'osm':
          source = new ol.source.OSM({
            crossOrigin: null,
          });
          break;
      }

      // TODO language support
      this.activeLayers_[geonaLayer.name] = new ol.layer.Tile({
        name: title,
        viewSettings: geonaLayer.viewSettings,
        projections: geonaLayer.projections,
        source: source,
      });

      // If we are re-ordering we will have an index
      if (index) {
        if (this.config.basemap === 'none') {
          this.map_.getLayers().insertAt(index + 1, this.activeLayers_[geonaLayer.name]);
        } else {
          this.map_.getLayers().insertAt(index, this.activeLayers_[geonaLayer.name]);
        }
      } else if (this.config.countryBorders !== 'none') {
        // Insert below the top layer
        this.map_.getLayers().insertAt(this.map_.getLayers().getLength() - 1, this.activeLayers_[geonaLayer.name]);
      } else {
        this.map_.addLayer(this.activeLayers_[geonaLayer.name]);
      }
      // if the config doesn't already contain this geonaLayer.name, add it to the layers object
      // if(this.config.layers){}
    } else {
      alert('This layer cannot be displayed with the current ' + this.map_.getView().getProjection().getCode() + ' map projection.');
      // alert(this.activeLayers_[geonaLayer.name].get('title') + ' cannot be displayed with the current ' + this.map_.getView().getProjection().getCode() + ' map projection.');
    }
  }

  /**
   * Remove the specified data layer from the map
   * @param {*} layerId The id of the data layer being removed
   */
  removeLayer(layerId) {
    if (this.map_.getLayers().getArray().includes(this.activeLayers_[layerId])) {
      this.map_.removeLayer(this.activeLayers_[layerId]);
      // remove this layerId from the config
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
    let center = options.center || {lat: currentCenterLatLon[0], lon: currentCenterLatLon[1]};
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
   * Load the data layers defined in the config
   * @private
   */
  // loadLayers_() {
  //   for (let addedLayer of this.config.layers) {
  //     addedLayer = addLayerDefaults(addedLayer);
  //     let source;
  //     switch (addedLayer.source.type) {
  //       case 'wms':
  //         source = new ol.source.TileWMS({
  //           url: addedLayer.source.url,
  //           crossOrigin: addedLayer.source.crossOrigin,
  //           projection: addedLayer.projections[0],
  //           attributions: addedLayer.source.attributions,
  //           params: {
  //             LAYERS: addedLayer.source.params.layers,
  //             VERSION: addedLayer.source.params.version,
  //             FORMAT: addedLayer.source.params.format,
  //             STYLES: addedLayer.source.params.styles,
  //             NUMCOLORBANDS: addedLayer.source.params.numcolorbands,
  //             time: addedLayer.source.params.time,
  //             wrapDateLine: addedLayer.source.params.wrapDateLine,
  //           },
  //         });
  //         break;
  //       case 'wmts':
  //         console.error('WMTS not yet supported (TODO)');
  //         break;
  //     }

  //     let layerData;
  //     for (let serverLayer of CCI5DAY.server.Layers) {
  //       if (serverLayer.Name === addedLayer.id) {
  //         layerData = serverLayer;
  //       }
  //     }

  //     this.activeLayers_[addedLayer.id] = new ol.layer.Tile({
  //       name: addedLayer.name,
  //       title: addedLayer.title,
  //       abstract: addedLayer.abstract,
  //       projections: addedLayer.projections,
  //       source: source,
  //       viewSettings: addedLayer.viewSettings,
  //       layerData: layerData,
  //     });
  //   }
  // }

  /**
   * Load the default basemaps, and any defined in the config.
   * @private
   */
  loadBasemaps_() {
    // TODO load from config too
    for (let layer of defaultBasemaps) {
      if (layer.source.type !== 'bing' || (layer.source.type === 'bing' && this.config.bingMapsApiKey)) {
        this.basemaps_[layer.id] = {};

        let source;
        switch (layer.source.type) {
          case 'wms':
            source = new ol.source.TileWMS({
              url: layer.source.url,
              crossOrigin: layer.source.crossOrigin,
              projection: layer.projections[0],
              attributions: layer.source.attributions,
              params: {
                LAYERS: layer.source.params.layers,
                VERSION: layer.source.params.version,
                FORMAT: layer.source.params.format,
                wrapDateLine: layer.source.params.wrapDateLine,
              },
            });
            break;
          case 'osm':
            source = new ol.source.OSM();
            break;
          case 'bing':
            source = new ol.source.BingMaps({
              key: this.config.bingMapsApiKey,
              imagerySet: layer.source.imagerySet,
            });
        }
        this.basemaps_[layer.id] = new ol.layer.Tile({
          id: layer.id,
          title: layer.title,
          description: layer.description,
          projections: layer.projections,
          source: source,
          viewSettings: layer.viewSettings,
        });
      } else {
        console.error('bingMapsApiKey is null or undefined');
      }
    }
  }

  /**
   * Load the default border layers, and any defined in the config.
   * @private
   */
  loadCountryBorderLayers_() {
    // TODO load from config too
    for (let layer of defaultBorders) {
      let source = new ol.source.TileWMS({
        url: layer.source.url,
        crossOrigin: layer.source.crossOrigin,
        projection: this.map_.getView().getProjection(),
        params: {
          LAYERS: layer.source.params.layers,
          VERSION: layer.source.params.version,
          STYLES: layer.source.params.styles,
        },
      });

      this.countryBorderLayers_[layer.id] = new ol.layer.Tile({
        id: layer.id,
        title: layer.title,
        source: source,
      });
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
 * @param  {Layer}          layer The Geona layer
 * @return {ol.source.WMTS}       A new openlayers WMTS source
 */
function wmtsSourceFromLayer(layer) {
  let tileMatrixSetId;

  // TODO Replace with thing to search for TileMatrixSet that supports the current projection
  for (let key in layer.tileMatrixSetLinks) {
    if (layer.tileMatrixSetLinks.hasOwnProperty(key)) {
      tileMatrixSetId = key;
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

  // TODO This should pick the default style, or one provided in a config
  let style;
  for (let key in layer.styles) {
    if (layer.styles.hasOwnProperty(key)) {
      console.log(key);
      style = key;
    }
  }

  // TODO dimensions - https://github.com/openlayers/openlayers/blob/v4.3.2/src/ol/source/wmts.js#L358
  let dimensions;

  let projection = ol.proj.get(tileMatrixSet.projection);

  // Get the extent in the right projection format from the layer bounding box
  let extent = ol.proj.transformExtent([layer.boundingBox.minLon, layer.boundingBox.minLat, layer.boundingBox.maxLon,
    layer.boundingBox.maxLat], 'EPSG:4326', projection);

  // TODO Not sure if wrapX should always be true. It should be fine though
  let wrapX = true;

  // TODO matrixLimits (get to pass through to wmtsTileGridFromMatrixSet)

  // Get the tile grid
  let tileGrid = wmtsTileGridFromMatrixSet(tileMatrixSet, extent);

  let urls = [];
  // requestEncoding is used to track which encoding we will use to request tiles.
  let requestEncoding = '';

  // TODO urls from operations metadata - https://github.com/openlayers/openlayers/blob/v4.3.2/src/ol/source/wmts.js#L409

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
  // OGC seems not to specify one way of defining REST encoding, so we have to standardise for OpenLayers.
  if (requestEncoding === 'RESTful') {
    requestEncoding = 'REST';
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

  console.log(urls);
  console.log(layer.identifier);
  console.log(tileMatrixSetId);
  console.log(format);
  console.log(projection);
  console.log(requestEncoding);
  console.log(tileGrid);
  console.log(style);
  console.log(dimensions);
  console.log(wrapX);

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
  console.log(matrixSet.projection);
  let axisOrientation = proj4(matrixSet.projection).oProj.axis;
  console.log(axisOrientation);
  console.log(projection);
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

    matrixIds.push(matrix.identifier);
    let resolution = matrix.scaleDenominator * 0.28E-3 / metersPerUnit; // Magic
    let tileWidth = matrix.tileWidth;
    let tileHeight = matrix.tileHeight;

    if (switchOriginXy) {
      // Swap the coordinaates for the top left corner if needs be
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
