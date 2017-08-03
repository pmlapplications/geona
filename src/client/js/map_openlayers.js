import $ from 'jquery';
import GeonaMap from './map';
import {baseLayers as commonBasemaps, borderLayers as commonBorders} from './map_common';

let ol;

/**
 * @implements {GeonaMap}
 */
export class OlMap extends GeonaMap {
  /**
   * Instantiate a new OlMap and create a new OpenLayers map
   * @param  {Object} config The map config to load
   */
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
    /** @private @type {Boolean} tracks whether the map has been created for the first time */
    this.initialized = false;

    this.loadBaseLayers();
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

    this.loadCountryBordersLayers();
    if (this.config.countryBorders) {
      this.setCountryBordersLayer(this.config.countryBorders);
    }

    this.initGraticule();
    if (this.config.graticule) {
      this.displayGraticule(this.config.graticule);
    }

    /** Must come last in the method */
    this.initialized = true;

    window.testMap = this;
    window.ol = ol;
  }

  /**
   * Remove the current basemap and add a new one.
   *
   * @param {String} basemap The id used to select the new basemap.
   */
  setBasemap(basemap) {
    if (this.initialized === true && this.config.basemap !== 'none') {
      console.log('removing layer');
      this.map_.removeLayer(this.map_.getLayers().item(0));
    }

    if (basemap !== 'none' ) {
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
    }
    this.config.basemap = basemap;
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
        this.setView({projection: projection});
      } else {
        // TODO replace with notification
        alert('Basemap ' + this.map_.getLayers().item(0).get('title') + ' does not support projection type ' + projection + '. Please select a different basemap.');
      }
    }

    this.config.projection = projection;
  }

  /**
   * Removes the current country borders layer, and replaces it
   * with the specified country borders layer.
   *
   * @param {String} border The Key for the border colour in borderLayers_
   */
  setCountryBordersLayer(border) {
    console.log(this.initialized);
    if (this.initialized === true && this.config.countryBorders !== 'none') {
      /** Removes the top-most layer (border will always be on top) */
      console.log(this.map_.getLayers().getLength());
      console.log('removing border layer');
      this.map_.removeLayer(this.map_.getLayers().item(this.map_.getLayers().getLength() - 1));
    }

    if (border !== 'none') {
      console.log('adding border layer');
      try {
        this.map_.addLayer(this.borderLayers_[border]);
      } catch (e) {
      /** error will have occurred because the borders have not loaded,
          or because the specified border does not exist. */
        console.error(e);
      }
    }

    this.config.countryBorders = border;
  }

  /**
   * Creates a new Key-Value map containing layer information for the
   * different country border layers.
   *
   * When adding a new layer, the Key should be set to the colour of the lines.
   */
  loadCountryBordersLayers() {
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
   * 
   * @param {Boolean} display if true, display the graticule
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
   * Uses the commonBasemaps array imported from './map_common.js'
   * in order to dynamically create OpenLayers basemaps.
   */
  loadBaseLayers() {
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
   *                           properties are: projection, maxExtent, fitExtent, center, minZoom, maxZoom, zoom.
   * //TODO save settings to config
   */
  setView(properties) {
    /** These are the default values used in Geona */
    let projection = this.config.projection;
    let maxExtent;
    let fitExtent;
    let center = [0, 0];
    let minZoom = 3;
    let maxZoom = 12;
    let zoom = 3;

    console.log(properties);

    /** The current values if the map exists */
    if (this.initialized === true) {
      if (this.map_.getView().getProjection()) {
        projection = this.map_.getView().getProjection().getCode();
      }
      if (properties.projection && this.map_.getView().getProjection().getCode() !== properties.projection) {
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
    if (properties.maxExtent) {
      /* Converts the min and max coordinates from LatLon to current projection */
      maxExtent = ol.proj.fromLonLat([properties.maxExtent[1], properties.maxExtent[0]], projection)
        .concat(ol.proj.fromLonLat([properties.maxExtent[3], properties.maxExtent[2]], projection));
    }
    if (properties.fitExtent) {
      fitExtent = ol.proj.fromLonLat([properties.fitExtent[1], properties.fitExtent[0]], projection)
        .concat(ol.proj.fromLonLat([properties.fitExtent[3], properties.fitExtent[2]], projection));
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

    /** Ensure that the center is within the maxExtent */
    if (maxExtent && !ol.extent.containsCoordinate(maxExtent, center)) {
      center = ol.extent.getCenter(maxExtent);
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
      extent: maxExtent,
      center: center,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zoom: zoom,
    });

    this.map_.setView(newView);

    /** Fit the map in the fitExtent */
    if (fitExtent) {
      console.log(fitExtent);
      this.map_.getView().fit(fitExtent, ol.extent.getSize(fitExtent));
      if (this.map_.getView().getZoom() < minZoom || this.map_.getView().getZoom() > maxZoom) {
        this.map_.getView().setZoom(zoom);
        this.map_.getView().setCenter(center);
      }
    }

    this.config.projection = projection;
    this.config.viewSettings.maxExtent = maxExtent;
    this.config.viewSettings.fitExtent = fitExtent;
    this.config.viewSettings.zoom = zoom;
    this.config.viewSettings.minZoom = minZoom;
    this.config.viewSettings.maxZoom = maxZoom;
    this.config.viewSettings.center = center;
  }
}
/**
 * Load the openlayers js library and dynamically import it.
 * @param {Function} next
 */
export function init(next) {
  if (ol) {
    /** If ol has already been loaded */
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
