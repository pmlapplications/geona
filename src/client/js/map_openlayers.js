import $ from 'jquery';
import GeonaMap from './map';
import {basemaps as defaultBasemaps, borderLayers as defaultBorders, latLonLabelFormatter, addLayerDefaults} from './map_common';

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

    // TODO this is only for testing
    window.olmap = this;
    window.ol = ol;

    /** @type {Object} The map config */
    this.config = config;
    /** @private @type {Object} The available basemaps, as OpenLayers Tile layers */
    this.basemaps_ = {};
    /** @private @type {Object} The available country border layers, as OpenLayers Tile layers */
    this.countryBorderLayers_ = {};
    /** @private @type {Object} The available data layers, as OpenLayers Tile layers */
    this.availableLayers_ = {};
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
          center: this.config.viewSettings.center,
          extent: this.config.viewSettings.maxExtent,
          maxZoom: this.config.viewSettings.maxZoom,
          minZoom: this.config.viewSettings.minZoom,
          projection: this.config.projection,
          zoom: this.config.viewSettings.zoom,
        }),
      target: mapDiv,
      controls: [
        new ol.control.Zoom({
          zoomInLabel: $('<span class="icon-zoom-in"></span>').appendTo('body')[0],
          zoomOutLabel: $('<span class="icon-zoom-out"></span>').appendTo('body')[0],
        }),

        new ol.control.FullScreen({
          label: $('<span class="icon-scale-spread-2"><span>').appendTo('body')[0],
          labelActive: $('<span class="icon-scale-reduce-1"><span>').appendTo('body')[0],
        }),

        new ol.control.Attribution({
          collapsible: false,
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
      this.map_.getLayers().insertAt(0, this.basemaps_[basemap]);
      if (this.basemaps_[basemap].get('projections').includes(this.map_.getView().getProjection().getCode())) {
        this.setView(this.basemaps_[basemap].get('viewSettings'));
      } else {
        let options = this.basemaps_[basemap].get('viewSettings');
        options.projection = this.basemaps_[basemap].get('projections')[0];
        this.setView(options);
      }
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
        // TODO replace with notification
        alert('Basemap ' + this.map_.getLayers().item(0).get('title') + ' does not support projection type ' + projection + '. Please select a different basemap.');
      }
    }

    this.config.projection = projection;
  }

  /**
   * Add the specified data layer onto the map.
   * @param {GeonaLayer} geonaLayer The GeonaLayer object to be created on the map.
   * @param {Integer} [index] The zero-based index to insert the layer into.
   */
  addLayer(geonaLayer, index) {
    console.log(geonaLayer);
    let source;
    switch (geonaLayer.serviceType) {
      case 'wms':
        source = new ol.source.TileWMS({
          url: geonaLayer.serviceUrl,
          attributions: geonaLayer.attributions,
          // TODO projection
          projection: this.map_.getView().getProjection().getCode() || geonaLayer.crs[0],
          crossOrigin: null,
          params: {
            LAYERS: geonaLayer.name,
            FORMAT: 'image/png', // TODO maybe change later
            // TODO STYLES:
            STYLES: 'boxfill/alg',
            // TODO time
            time: '2015-12-27T00:00:00.000Z',
            // TODO wrapDateLine
            wrapDateLine: true,
            // TODO NUMCOLORBANDS
            NUMCOLORBANDS: 255,
            VERSION: '1.1.1',
          },
        });
        break;
      case 'wmts':
        // TODO wmts
    }

    // TODO remove and fix where geona.js gets its layer data from
    let layerData = {
      name: geonaLayer.name,
      title: geonaLayer.title,
      abstract: geonaLayer.abstract,
      firstDate: geonaLayer.firstDate,
      lastDate: geonaLayer.lastDate,
      boundingBox: geonaLayer.boundingBox,
      serviceUrl: geonaLayer.serviceUrl,
      serviceType: geonaLayer.serviceType,
    };

    this.availableLayers_[geonaLayer.name] = new ol.layer.Tile({
      name: geonaLayer.name,
      viewSettings: this.config.viewSettings,
      projections: geonaLayer.crs,
      source: source,
      layerData: layerData,
    });

    // for (let configLayer of this.config.layers) {
    //   if (configLayer.name === geonaLayer.name) {
    //     configLayer = addLayerDefaults(configLayer);
    //     let source;
    //     switch (configLayer.source.type) {
    //       case 'wms':
    //         source = new ol.source.TileWMS({
    //           url: configLayer.source.url,
    //           attributions: configLayer.source.attributions,
    //           projection: geonaLayer.crs[0],
    //           crossOrigin: null,
    //           params: {
    //             LAYERS: configLayer.source.params.layers,
    //             FORMAT: configLayer.source.params.format,
    //             STYLES: configLayer.source.params.styles,
    //             time: configLayer.source.params.time,
    //             wrapDateLine: configLayer.source.params.wrapDateLine,
    //             NUMCOLORBANDS: geonaLayer.colorBands,
    //             VERSION: '1.1.1',
    //           },
    //         });
    //         break;
    //       case 'wmts':
    //         console.error('WMTS not yet supported (TODO)');
    //         break;
    //     }

    //     let layerData;
    //     for (let serverLayer of CCI5DAY.server.Layers) {
    //       if (serverLayer.Name === configLayer.name) {
    //         layerData = serverLayer;
    //       }
    //     }

    //     this.availableLayers_[configLayer.name] = new ol.layer.Tile({
    //       name: configLayer.name,
    //       viewSettings: configLayer.viewSettings,
    //       projections: geonaLayer.crs,
    //       source: source,
    //       layerData: layerData,
    //     });
    //   }
    // }

    if (this.availableLayers_[geonaLayer.name].get('projections').includes(this.map_.getView().getProjection().getCode())) {
      // If we are re-ordering we will have an index
      if (index) {
        if (this.config.basemap === 'none') {
          this.map_.getLayers().insertAt(index + 1, this.availableLayers_[geonaLayer.name]);
        } else {
          this.map_.getLayers().insertAt(index, this.availableLayers_[geonaLayer.name]);
        }
      } else if (this.config.countryBorders !== 'none') {
        // Insert below the top layer
        this.map_.getLayers().insertAt(this.map_.getLayers().getLength() - 1, this.availableLayers_[geonaLayer.name]);
      } else {
        this.map_.addLayer(this.availableLayers_[geonaLayer.name]);
      }
      // if the config doesn't already contain this geonaLayer.name, add it to the layers object
      // if(this.config.layers){}
    } else {
      alert(this.availableLayers_[geonaLayer.name].get('title') + ' cannot be displayed with the current ' + this.map_.getView().getProjection().getCode() + ' map projection.');
    }
  }

  /**
   * Remove the specified data layer from the map
   * @param {*} layerId The id of the data layer being removed
   */
  removeLayer(layerId) {
    if (this.map_.getLayers().getArray().includes(this.availableLayers_[layerId])) {
      this.map_.removeLayer(this.availableLayers_[layerId]);
      // remove this layerId from the config
    }
  }

  /**
   * Makes an invisible layer visible
   * @param {*} layerId The id of the data layer being made visible
   */
  showLayer(layerId) {
    this.availableLayers_[layerId].setVisible(true);
  }

  /**
   * Makes a layer invisible, but keeps it on the map
   * @param {*} layerId The id of the data layer being made hidden
   */
  hideLayer(layerId) {
    this.availableLayers_[layerId].setVisible(false);
  }

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
  setView(options) {
    let center = options.center ||
      ol.proj.toLonLat(this.map_.getView().getCenter(), this.map_.getView().getProjection().getCode()).reverse();
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
    maxExtent = ol.proj.fromLonLat([maxExtent[1], maxExtent[0]], projection)
      .concat(ol.proj.fromLonLat([maxExtent[3], maxExtent[2]], projection));

    if (fitExtent) {
      fitExtent = ol.proj.fromLonLat([fitExtent[1], fitExtent[0]], projection)
        .concat(ol.proj.fromLonLat([fitExtent[3], fitExtent[2]], projection));
    }
    center = ol.proj.fromLonLat(center.reverse(), projection);

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

  //     this.availableLayers_[addedLayer.id] = new ol.layer.Tile({
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
 * @param {Function} next
 */
export function init(next) {
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

    mapJs.src = 'js/vendor_openlayers.js';
    head.appendChild(mapJs);
  }
}
