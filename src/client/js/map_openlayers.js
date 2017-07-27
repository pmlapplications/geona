import $ from 'jquery';
import GeonaMap from './map';
import {baseLayers as commonBasemaps, borderLayers as commonBorders} from './map_common';

let ol;

/**
 * @implements {GeonaMap}
 */
export class OlMap extends GeonaMap {
  constructor(config) {
    super();
    /** @type {Object} object containing configuration options */
    this.config = config;
    /** @private @type {Object} object containing OpenLayers Tile objects for each basemap */
    this.baseLayers_ = null;
    /** @private @type {ol.Map} an OpenLayers map used for displaying layers */
    this.map_ = null;
    /** @private @type {Object} object containing OpenLayers Tile objects for each country border layer */
    this.borderLayers_ = null;
    /** @private @type {ol.Graticule} an OpenLayers graticule which is added to the map  */
    this.graticule_ = null;
    /** @type {Boolean} tracks whether a basemap is currently on the map */
    this.baseActive = false;
    /** @type {Boolean} tracks whether a border layer is currently on the map */
    this.borderActive = false;
  }

  /**
    * Creates a new OpenLayers map and adds various features and controls to the map.
    */
  createMap() {
    this.initBaseLayers();
    this.map_ = new ol.Map({
      target: this.config.divId,
      controls: [
        new ol.control.Zoom({
          zoomInLabel: $('<span class="icon-zoom-in"></span>').appendTo('body')[0],
          zoomOutLabel: $('<span class="icon-zoom-out"></span>').appendTo('body')[0],
        }),

        new ol.control.FullScreen({
          label: $('<span class="icon-arrow-move-1"><span>').appendTo('body')[0],
        }),

        new ol.control.Attribution({
          collapsible: false,
          collapsed: false,
        }),

        new ol.control.ScaleLine({}),
      ],

    });
    // If basemap defined in the config, add it to the map.
    if (this.config.basemap) {
      this.map_.addLayer(this.baseLayers_[this.config.basemap].tile);
      this.map_.setView(this.baseLayers_[this.config.basemap].view);
      this.baseActive = true;
    }

    this.createCountryBordersLayers();
    if (this.config.countryBorders) {
      this.setCountryBordersLayer(this.config.countryBorders);
    }

    this.createGraticule();
    if (this.config.graticules === 'true') {
      this.toggleGraticule();
    }
  }

  /**
    * Remove the current basemap and add a new one.
    *
    * @param {String} basemap The title used to select the new basemap
    */
  setBaseMap(basemap) {
    this.removeBaseMap_();
    this.addBaseMap_(basemap);
  }

  /**
    * Remove the current basemap layer.
    *
    * TODO test with multiple layers on map (function may be removing ALL layers)
    * @private
    */
  removeBaseMap_() {
    if (this.baseActive) {
      this.map_.removeLayer(this.map_.getLayers().item(0));
      this.baseActive = false;
    }
  }

  /**
    * Sets new basemap layer, and updates the View.
    *
    * TODO test with multiple layers on map (function may be adding above existing layers)
    *
    * @private
    * @param {String} basemap The title used to select the new basemap.
    */
  addBaseMap_(basemap) {
    if (basemap !== 'none') {
      this.map_.getLayers().insertAt(0, this.baseLayers_[basemap].tile);
      this.map_.setView(this.baseLayers_[basemap].view);
      this.baseActive = true;
    }
  }

  /**
    * Sets the this.config.basemap to the map's current base layer
    *
    * TODO test with real config
    */
  setConfigBaseMap() {
    this.config.basemap = this.map_.getLayers().item(0);
  }

  /**
    * Changes the projection style, if allowed for the current basemap.
    *
    * @param {String} projection The full code of the projection style (e.g. 'ESPG:4326')
    */
  setProjection(projection) {
    if (this.baseActive === true) {
      let basemapId = this.map_.getLayers().item(0).get('id');
      /* If basemap supports new projection, we can change the view */
      if (this.baseLayers_[basemapId].tile.get('projections').indexOf(projection) >= 0) {
        let newView = new ol.View({
          projection: projection,
          minZoom: this.map_.getView().getMinZoom(),
          maxZoom: this.map_.getView().getMaxZoom(),
          zoom: this.map_.getView().getZoom(),
          center: ol.proj.fromLonLat(this.map_.getView().getCenter(), projection),
        });
        this.map_.setView(newView);
      } else {
        alert('basemap ' + basemapId + ' does not support projection type ' + projection + '. Please select a different basemap.');
      }
    }
  }

  /**
    * Removes the current country borders layer, and replaces it
    * with the specified country borders layer.
    *
    * @param {String} border The Key for the border colour in borderLayers_
    */
  setCountryBordersLayer(border) {
    this.removeCountryBordersLayer_();
    this.addCountryBordersLayer_(border);
  }

  /**
    * Adds the specified country borders layer to the top of the map.
    *
    * @private
    * @param {String} border The Key for the border colour in borderLayers_
    */
  addCountryBordersLayer_(border) {
    if (border !== 'none') {
      try {
        this.map_.addLayer(this.borderLayers_[border]);
        this.borderActive = true;
      } catch (e) {
      // error will have occurred because the borders have not loaded,
      // or because the specified border does not exist.
        console.error(e);
      }
    }
  }

  /**
    * Removes the currently active country borders layer.
    * @private
    */
  removeCountryBordersLayer_() {
    if (this.borderActive === true) {
      // Removes the top-most layer (border will always be on top)
      this.map_.removeLayer(this.map_.getLayers().item(this.map_.getLayers().getLength() - 1));
      this.borderActive = false;
    }
  }

  /**
    * Replaces/creates the countryBorders parameter in the config, setting it
    * to the current country borders layer.
    */
  setConfigCountryBordersLayer() {
    if (this.borderActive === true) {
      // sets the config parameter to the top layer
      this.config.countryBorders = this.map_.getLayers().item(this.map_.getLayers().getSize() - 1);
    }
  }

  /**
    * Creates a new Key-Value map containing layer information for the
    * different country border layers.
    *
    * When adding a new layer, the Key should be set to the colour of the lines.
    */
  createCountryBordersLayers() {
    this.borderLayers_ = {};

    for (let layer of commonBorders) {
      let source = new ol.source.TileWMS({
        url: layer.source.url,
        crossOrigin: layer.source.crossOrigin,
        params: {
          LAYERS: layer.source.params.LAYERS,
          VERSION: layer.source.params.VERSION,
          STYLES: layer.source.params.STYLES,
          SRS: this.map_.getView().getProjection(),
        },
      });

      this.borderLayers_[layer.id] = new ol.layer.Tile({
        id: layer.id,
        title: layer.title,
        source: source,
      });
    }
  }

  /**
    * Initialises the graticule, but does not make it visible.
    *
    * The graticule is made visible in the toggleGraticule() function.
    */
  createGraticule() {
    this.graticule_ = new ol.Graticule({
      strokeStyle: new ol.style.Stroke({
        color: 'rgba(255,255,255,0.9)',
        width: 1,
        lineDash: [0.5, 4],
      }),
      showLabels: false,
    });
  }

  /**
    * Toggles visibility of map graticule.
    */
  toggleGraticule() {
    if (this.config.graticules) {
      this.graticule_.setMap(this.map_);
    } else {
      try {
        this.graticule_.setMap();
      } catch (e) {
        console.error('Caught error when trying to call graticule.setMap() in function toggleGraticule().');
      }
    }
  }

  /**
    * Uses the commonBasemaps array imported from './map_common.js'
    * in order to dynamically create OpenLayers basemaps.
    */
  initBaseLayers() {
    this.baseLayers_ = {};

    for (let layer of commonBasemaps) {
      this.baseLayers_[layer.id] = {tile: {}, view: {}};

      let source;
      switch (layer.source.type) {
        case 'wms':
          source = new ol.source.TileWMS({
            url: layer.source.url,
            crossOrigin: layer.source.crossOrigin,
            params: {
              LAYERS: layer.source.params.LAYERS,
              VERSION: layer.source.params.VERSION,
              SRS: layer.source.params.SRS,
              FORMAT: layer.source.params.FORMAT,
              wrapDateLine: layer.source.params.wrapDateLine,
            },
            attributions: layer.source.attributions,
          });
          break;
        case 'osm':
          source = new ol.source.OSM();
          break;
      }
      this.baseLayers_[layer.id].tile = new ol.layer.Tile({
        id: layer.id,
        title: layer.title,
        description: layer.description,
        projections: layer.projections,
        source: source,
      });
      this.baseLayers_[layer.id].view = this.initView(layer.id);
    }
  }

  /**
   * Creates a View with the correct center and zoom settings.
   * 'Correct' refers to two situations:
   * - When initialising the map, setting the default center and zoom as the same
   *   longitude and latitude for all basemaps
   * - When changing the basemap, keeping the center and zoom in the current
   *   position, UNLESS the new basemap only shows a specific area of the
   *   world, in which case it will relocate to that area.
   *
   * @param {*} basemap The id of the basemap.
   * @return {ol.View} A new View to set on the map.
   */
  initView(basemap) {
    // TODO should these have variable comments?
    let basemapSettings = {};
    for (let i = 0; i < commonBasemaps.length; i++) {
      basemapSettings[commonBasemaps[i].id] = commonBasemaps[i];
    }
    let projection = basemapSettings[basemap].projections[0];
    let minZoom = 3;
    let maxZoom = 12;
    let zoom = 3;
    let center = [0, 0];

    /* The current center and zoom values */
    if (this.map_ && this.map_.getView().getCenter()) {
      center = this.map_.getView().getCenter();
      zoom = this.map_.getView().getZoom();
    }

    /* Settings taken from map_common.js */
    if (basemapSettings[basemap].viewSettings) {
      if (basemapSettings[basemap].viewSettings.minZoom) {
        minZoom = basemapSettings[basemap].viewSettings.minZoom;
      }
      if (basemapSettings[basemap].viewSettings.maxZoom) {
        maxZoom = basemapSettings[basemap].viewSettings.maxZoom;
      }
      /* Maps which only display a certain part of the world have
         their zoom and center set to their custom default */
      if (basemapSettings[basemap].viewSettings.zoom) {
        zoom = basemapSettings[basemap].viewSettings.zoom;
      }
      if (basemapSettings[basemap].viewSettings.center) {
        center = basemapSettings[basemap].viewSettings.center;
      }
    }

    /* Makes sure the zoom value is valid for the new basemap */
    if (zoom > basemapSettings[basemap].viewSettings.maxZoom) {
      zoom = basemapSettings[basemap].viewSettings.maxZoom;
    }

    let view = new ol.View({
      projection: projection,
      center: ol.proj.fromLonLat(center, projection),
      minZoom: minZoom,
      maxZoom: maxZoom,
      zoom: zoom,
    });
    return view;
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
