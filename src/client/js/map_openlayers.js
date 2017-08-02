import $ from 'jquery';
import GeonaMap from './map';
import {baseLayers as commonBasemaps, borderLayers as commonBorders} from './map_common';

let ol;

/**
 * @implements {GeonaMap}
 */
export class OlMap extends GeonaMap {
  constructor(config) {
    // TODO JSDoc comment for class OlMap
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
    /** @private @type {Boolean} tracks whether a basemap is currently on the map */
    this.baseActive_ = false;
    /** @private @type {Boolean} tracks whether a border layer is currently on the map */
    this.borderActive_ = false;
    /** @private @type {Boolean} tracks whether the map has been created for the first time */
    this.mapInitiallyCreated_ = false;

    this.initBaseLayers();
    this.map_ = new ol.Map({
      view: new ol.View(
        {
          center: this.config.viewSettings.center,
          minZoom: this.config.viewSettings.minZoom,
          maxZoom: this.config.viewSettings.maxZoom,
          zoom: this.config.viewSettings.zoom,
        }),
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

    if (this.config.basemap) {
      this.setBasemap(this.config.basemap);
    }

    this.initCountryBordersLayers();
    if (this.config.countryBorders) {
      this.setCountryBordersLayer(this.config.countryBorders);
    }

    this.initGraticule();
    if (this.config.graticules === 'true') {
      this.toggleGraticule();
    }

    window.testMap = this;
    window.ol = ol;
  }

  /**
   * Remove the current basemap and add a new one.
   *
   * @param {String} basemap The id used to select the new basemap.
   */
  setBasemap(basemap) {
    this.removeBasemap_();
    this.addBasemap_(basemap);
  }

  /**
   * Remove the current basemap layer.
   *
   * TODO test with multiple layers on map (function may be removing ALL layers)
   * @private
   */
  removeBasemap_() {
    if (this.baseActive_) {
      this.map_.removeLayer(this.map_.getLayers().item(0));
      this.baseActive_ = false;
    }
  }

  /**
   * Sets new basemap layer, and updates the View.
   *
   * TODO test with multiple layers on map (function may be adding above existing layers)
   * TODO 'basemap id not found' error check? Might not matter actually
   *
   * @private
   * @param {String} basemap The id used to select the new basemap.
   */
  addBasemap_(basemap) {
    if (basemap !== 'none') {
      this.map_.getLayers().insertAt(0, this.baseLayers_[basemap]);
      if (this.baseLayers_[basemap].get('projections').includes(this.map_.getView().getProjection().getCode())) {
        console.log('Projection doesnt need to change');
        this.setView(this.baseLayers_[basemap].get('viewSettings'));
      } else {
        console.log('Projection needs to change');
        let options = this.baseLayers_[basemap].get('viewSettings');
        options.projection = this.baseLayers_[basemap].get('projections')[0];
        console.log(options);
        this.setView(options);
      }
      this.baseActive_ = true;
    }
  }

  /**
   * Sets the this.config.basemap to the map's current base layer
   *
   * TODO test with real config
   */
  setConfigBasemap() {
    this.config.basemap = this.map_.getLayers().item(0);
  }

  /**
   * Changes the projection style, if allowed for the current basemap.
   *
   * @param {String} projection The full code of the projection style (e.g. 'ESPG:4326')
   */
  setProjection(projection) {
    // TODO test with different basemap with support for multiple projections (might be resetting to projections[0])
    if (this.baseActive_ === true) {
      let basemapId = this.map_.getLayers().item(0).get('id');
      /* If basemap supports new projection, we can change the view */
      if (this.baseLayers_[basemapId].get('projections').includes(projection)) {
        this.setView({projection: projection}, false);
      } else {
        // TODO replace with notification
        alert('Basemap ' + this.map_.getLayers().item(0).get('title') + ' does not support projection type ' + projection + '. Please select a different basemap.');
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
        this.borderActive_ = true;
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
    if (this.borderActive_ === true) {
      // Removes the top-most layer (border will always be on top)
      this.map_.removeLayer(this.map_.getLayers().item(this.map_.getLayers().getLength() - 1));
      this.borderActive_ = false;
    }
  }

  /**
   * Replaces/creates the countryBorders parameter in the config, setting it
   * to the current country borders layer.
   */
  setConfigCountryBordersLayer() {
    if (this.borderActive_ === true) {
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
  initCountryBordersLayers() {
    this.borderLayers_ = {};

    for (let layer of commonBorders) {
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
  initGraticule() {
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
      this.graticule_.setMap();
    }
  }

  /**
   * Uses the commonBasemaps array imported from './map_common.js'
   * in order to dynamically create OpenLayers basemaps.
   */
  initBaseLayers() {
    this.baseLayers_ = {};

    for (let layer of commonBasemaps) {
      if (layer.source.type !== 'bing' || (layer.source.type === 'bing' && this.config.bingMapsApiKey)) {
        this.baseLayers_[layer.id] = {};

        let source;
        switch (layer.source.type) {
          case 'wms':
            source = new ol.source.TileWMS({
              url: layer.source.url,
              crossOrigin: layer.source.crossOrigin,
              projection: layer.projections[0],
              params: {
                LAYERS: layer.source.params.layers,
                VERSION: layer.source.params.version,
                FORMAT: layer.source.params.format,
                wrapDateLine: layer.source.params.wrapDateLine,
              },
              attributions: layer.source.attributions,
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
        this.baseLayers_[layer.id] = new ol.layer.Tile({
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
   * Changes the map view based on the properties of the object passed in.
   *
   * @param {Object} properties An Object containing various properties used in order to set the View of the map. Valid
   *                           properties are: projection, extent, center, minZoom, maxZoom, zoom.
   * @param {Boolean} fitToExtent If true, the zoom will adjust to show the whole extent of the new View.
   */
  setView(properties, fitToExtent = false) {
    /** These are the default values used in Geona */
    let projection = this.config.projection;
    let extent;
    let center = [0, 0];
    let minZoom = 3;
    let maxZoom = 12;
    let zoom = 3;

    console.log(properties);

    /** The current values if the map exists */
    if (this.mapInitiallyCreated_ === true) {
      if (this.map_.getView().getProjection()) {
        projection = this.map_.getView().getProjection().getCode();
      }
      if ((properties.projection) && (this.map_.getView().getProjection().getCode() !== properties.projection)) {
        center = ol.proj.toLonLat(this.map_.getView().getCenter(), this.map_.getView().getProjection().getCode());
        center = ol.proj.fromLonLat(center, properties.projection);
      } else {
        center = this.map_.getView().getCenter();
      }
      if (this.map_.getView().getZoom()) {
        zoom = this.map_.getView().getZoom();
      }
    }

    /** The properties that might be defined in the parameter */
    if (properties.projection) {
      projection = properties.projection;
    }
    if (properties.extent) {
      /* Converts the min and max coordinates from LatLon to current projection */
      extent = ol.proj.fromLonLat([properties.extent[1], properties.extent[0]], projection).concat(ol.proj.fromLonLat([properties.extent[3], properties.extent[2]], projection));
    }
    if (properties.center) {
      center = ol.proj.fromLonLat([properties.center[1], properties.center[0]], projection);
    }
    if (properties.minZoom) {
      minZoom = properties.minZoom;
    }
    if (properties.maxZoom) {
      maxZoom = properties.maxZoom;
    }
    if (properties.zoom) {
      zoom = properties.zoom;
    }

    /** Ensure that the center is within the extent */
    if ((extent) && (!ol.extent.containsCoordinate(extent, center))) {
      center = ol.extent.getCenter(extent);
    }

    /** Ensure that the zoom is within the accepted bounds */
    if (zoom < minZoom) {
      zoom = minZoom;
    }
    if (zoom > maxZoom) {
      zoom = maxZoom;
    }

    let newView = new ol.View({
      projection: projection,
      extent: extent,
      center: center,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zoom: zoom,
    });

    this.map_.setView(newView);

    this.mapInitiallyCreated_ = true;

    /** Optionally fit the map in the extent */
    if ((extent) && (fitToExtent)) {
      this.map_.getView().fit(extent, ol.extent.getSize(extent));
      if ((this.map_.getView().getZoom() < minZoom) || (this.map_.getView().getZoom() > maxZoom)) {
        this.map_.getView().setZoom(zoom);
        this.map_.getView().setCenter(center);
      }
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
