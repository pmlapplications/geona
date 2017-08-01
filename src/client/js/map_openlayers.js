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
    /** @private @type {Boolean} tracks whether a basemap is currently on the map */
    this.baseActive_ = false;
    /** @private @type {Boolean} tracks whether a border layer is currently on the map */
    this.borderActive_ = false;
    /** @private @type {Boolean} tracks whether the map has been created for the first time */
    this.mapInitiallyCreated_ = false;

    window.testMap = this;
    window.ol = ol;
  }

  /**
    * Creates a new OpenLayers map and adds various features and controls to the map.
    */
  createMap() {
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
    // If basemap defined in the config, add it to the map.
    if (this.config.basemap) {
      this.setBasemap(this.config.basemap);
    }

    this.initCountryBordersLayers();
    if (this.config.countryBorders) {
      // this.setCountryBordersLayer(this.config.countryBorders);
    }

    this.initGraticule();
    if (this.config.graticules === 'true') {
      this.toggleGraticule();
    }

    // this.setBasemap('eox');
    // this.setProjection('EPSG:3857');
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
      this.map_.getLayers().insertAt(0, this.baseLayers_[basemap].tile);
      this.setView(this.populateSetViewProperties_(basemap));
      this.baseActive_ = true;
    }
  }

  addBasemapTEST_(basemap) {
    if (basemap !== 'none') {
      this.map_.getLayers().insertAt(0, this.baseLayers_[basemap].tile);
      // this.setView(this.populateSetViewProperties_(basemap));
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
      if (this.baseLayers_[basemapId].tile.get('projections').includes(projection)) {
        this.setView({projection: projection}, false);
      } else {
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
          LAYERS: layer.source.params.LAYERS,
          VERSION: layer.source.params.VERSION,
          STYLES: layer.source.params.STYLES,
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
      if (layer.source.type !== 'bing' || (layer.source.type === 'bing' && this.config.bingMapsApiKey)) {
        this.baseLayers_[layer.id] = {tile: {}, view: {}};

        let source;
        switch (layer.source.type) {
          case 'wms':
            source = new ol.source.TileWMS({
              url: layer.source.url,
              crossOrigin: layer.source.crossOrigin,
              projection: layer.projections[0],
              params: {
                LAYERS: layer.source.params.LAYERS,
                VERSION: layer.source.params.VERSION,
                FORMAT: layer.source.params.FORMAT,
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
        this.baseLayers_[layer.id].tile = new ol.layer.Tile({
          id: layer.id,
          title: layer.title,
          description: layer.description,
          projections: layer.projections,
          source: source,
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
                               properties are projection | extent | center | minZoom | maxZoom | zoom.
  * @param {Boolean} fitToExtent If true, the zoom will adjust to show the whole extent of the new View.
  *
  * TODO fitToExtent working
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
      if (this.map_.getView().getProjection().getCode() !== properties.projection) {
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
      /* Converts the min and max coordinates from LonLat to current projection */
      extent = ol.proj.fromLonLat([properties.extent[0], properties.extent[1]], projection).concat(ol.proj.fromLonLat([properties.extent[2], properties.extent[3]], projection));
    }
    if (properties.center) {
      center = ol.proj.fromLonLat(properties.center, projection);
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

    /** Optionally fit the map in the extent */
    if ((extent) && (fitToExtent)) {

    }

    /** Ensure that the center is within the extent */
    if ((extent) && (!ol.extent.containsCoordinate(extent, center))) {
      console.log('Center is not in extent');
      center = ol.proj.fromLonLat(ol.extent.getCenter(extent), projection);
    }

    /** Ensure that the zoom is within the accepted bounds */
    if (zoom < minZoom) {
      console.log('Zoom is less than the minZoom');
      zoom = minZoom;
    }
    if (zoom > maxZoom) {
      console.log('Zoom is greater than the maxZoom');
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

    /** Skips the first layer, refreshes the rest */
    for (let i = 1; i < this.map_.getLayers().getLength(); i++) {
      console.log('Entered for loop');
      this.refreshLayerProjection_(this.map_.getLayers().item(i));
    }

    this.mapInitiallyCreated_ = true;
  }

  /**
   * Sets layer to match the projection of the basemap
   *
   * @param {ol.layer.Layer} layer
   */
  refreshLayerProjection_(layer) {
    console.log(layer.getProperties());
    console.log(layer.getProperties().source.type);
    switch (layer.getProperties().source.type) {
      case 'border':
        this.initCountryBordersLayers();
        this.setConfigCountryBordersLayer(layer.getProperties().id);
    }
  }

  /**
   * Populates an object with a new basemap's specific options.
   * (i.e. when a new basemap is added, this makes sure the specified properties from viewSettings are applied).
   *
   * @private
   * @param {String} basemap The id of the basemap for which we will make the View.
   * @return {Object} an object with certain properties set.
   */
  populateSetViewProperties_(basemap) {
    let basemapSettings = this.searchObjectArray_(commonBasemaps, 'id', basemap);
    let properties = {};

    if (basemapSettings.projections.includes(this.config.projection)) {
      properties.projection = this.config.projection;
    } else {
      properties.projection = basemapSettings.projections[0];
    }
    if (basemapSettings.viewSettings.extent) {
      /** Convert the view settings into LonLat from LatLon */
      properties.extent = [
        basemapSettings.viewSettings.extent[1],
        basemapSettings.viewSettings.extent[0],
        basemapSettings.viewSettings.extent[3],
        basemapSettings.viewSettings.extent[2],
      ];
    }
    if (basemapSettings.viewSettings.center) {
      /** Convert the view settings into LonLat from LatLon */
      properties.center = [
        basemapSettings.viewSettings.center[1],
        basemapSettings.viewSettings.center[0],
      ];
    }
    if (basemapSettings.viewSettings.minZoom) {
      properties.minZoom = basemapSettings.viewSettings.minZoom;
    }
    if (basemapSettings.viewSettings.maxZoom) {
      properties.maxZoom = basemapSettings.viewSettings.maxZoom;
    }
    if (basemapSettings.viewSettings.zoom) {
      properties.zoom = basemapSettings.viewSettings.zoom;
    }

    return properties;
  }

  /**
  * Searches an array of objects for a specific value of a property, then returns the object if found, or null if not.
  *
  * @private
  * @param {Array} arrayOfObjects The array to search.
  * @param {String} property The property to check in each object.
  * @param {*} value The desired value of the property.
  *
  * @return {Object | null} The object with the specified value in its property.
  */
  searchObjectArray_(arrayOfObjects, property, value) {
    for (let i = 0; i < arrayOfObjects.length; i++) {
      if (arrayOfObjects[i][property] === value) {
        return arrayOfObjects[i];
      }
    }
    return null;
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
