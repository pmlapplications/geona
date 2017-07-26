import $ from 'jquery';
import {baselayers as commonBasemaps} from './map_common.js';

let ol;
// baseLayers is an object containing the Tile and View information for
// various basemap types.
// let baseLayers;
// let map;
// let borderLayers;
// let graticule;
// let baseActive = false;
// let borderActive = false;

export class OlMap {
  constructor(config) {
    /** @type {Object} object containing configuration options */
    this.config = config;
    /** @type {Map} a Key-Value map with base layer Tile and View objects */
    this.baseLayers = null;
    /** @type {ol.Map} an OpenLayers map used for displaying layers */
    this.map = null;
    /** @type {Map} a Key-Value map with various country border layers */
    this.borderLayers = null;
    /** @type {ol.Graticule} an OpenLayers graticule which is added to the map  */
    this.graticule = null;
    /** @type {Boolean} tracks whether a base map is currently on the map */
    this.baseActive = false;
    /** @type {Boolean} tracks whether a border layer is currently on the map */
    this.borderActive = false;
  }

  /**
    * Creates a new OpenLayers map and adds various features and controls to the map.
    */
  createMap() {
    this.createBaseLayers();
    this.map = new ol.Map({
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
    // If base map defined in the config, add it to the map.
    if (this.config.basemap) {
      this.map.addLayer(this.baseLayers[this.config.basemap].tile);
      this.map.setView(this.baseLayers[this.config.basemap].view);
      this.baseActive = true;
    }

    this.createCountryBordersLayers();
    if (this.config.countryBorders) {
      this.addCountryBordersLayer(this.config.countryBorders);
    }

    this.createGraticule();
    if (this.config.graticules === 'true') {
      this.toggleGraticule();
    }
  }

  /**
    * Remove the current base map and add a new one.
    *
    * @param {String} baseMap The title used to select the new basemap
    */
  changeBaseMap(baseMap) {
    this.removeBaseMap();
    this.addBaseMap(baseMap);
  }

  /**
    * Remove the current base map layer.
    *
    * TODO test with multiple layers on map (function may be removing ALL layers)
    */
  removeBaseMap() {
    this.map.removeLayer(this.map.getLayers().item(0));
    this.baseActive = false;
  }

  /**
    * Sets new base map layer, and updates the View.
    *
    * TODO test with multiple layers on map (function may be adding above existing layers)
    *
    * @param {String} baseMap The title used to select the new base map.
    */
  addBaseMap(baseMap) {
    this.map.getLayers().insertAt(0, this.baseLayers[baseMap].tile);
    this.map.setView(this.baseLayers[baseMap].view);
    this.baseActive = true;
  }

  /**
    * Sets the this.config.basemap to the map's current base layer
    *
    * TODO test with real config
    */
  setConfigBaseMap() {
    this.config.basemap = this.map.getLayers().item(0);
  }

  /**
    * Changes the projection style, if allowed for the current base map.
    *
    * @param {String} projection The full code of the projection style (e.g. 'ESPG:4326')
    */
  changeProjection(projection) {
    // If there is a base map
    if (this.baseActive === true) {
      let baseMapTitle = this.map.getLayers().item(0).get('title');
      // If base map supports new projection, we can change it
      if (this.baseLayers[baseMapTitle].tile.get('projections').indexOf(projection) >= 0) {
        this.map.setView(this.getViewSettings(projection));
      } else {
        alert('Base map ' + baseMapTitle + ' does not support projection type ' + projection + '. Please select a different base map.');
      }
    }
  }

  /**
    * Removes the current country borders layer, and replaces it
    * with the specified country borders layer.
    *
    * @param {String} border The Key for the border colour in borderLayers
    */
  changeCountryBordersLayer(border) {
    this.removeCountryBordersLayer();
    this.addCountryBordersLayer(border);
  }

  /**
    * Adds the specified country borders layer to the top of the map.
    *
    * @param {String} border The Key for the border colour in borderLayers
    */
  addCountryBordersLayer(border) {
    try {
      this.map.addLayer(this.borderLayers.get(border));
      this.borderActive = true;
    } catch (e) {
      // error will have occurred because the borders have not loaded,
      // or because the specified border does not exist.
      console.error(e);
    }
  }

  /**
    * Removes the currently active country borders layer.
    */
  removeCountryBordersLayer() {
    if (this.borderActive === true) {
      // Removes the top-most layer (border will always be on top)
      this.map.removeLayer(this.map.getLayers().item(this.map.getLayers().getLength() - 1));
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
      this.config.countryBorders = this.map.getLayers().item(this.map.getLayers().getSize() - 1);
    }
  }

  /**
    * Creates a new Key-Value map containing layer information for the
    * different country border layers.
    *
    * When adding a new layer, the Key should be set to the colour of the lines.
    */
  createCountryBordersLayers() {
    // new Key-Value map, not OpenLayers map
    this.borderLayers = new Map();
    this.borderLayers.set('white', new ol.layer.Tile({
      id: 'countries_all_white',
      title: 'White border lines',
      source: new ol.source.TileWMS({
        url: 'https://rsg.pml.ac.uk/geoserver/wms?',
        crossOrigin: null,
        params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line-white', SRS: this.map.getView().getProjection()},
      }),
    }));
    this.borderLayers.set('black', new ol.layer.Tile({
      id: 'countries_all_black',
      title: 'Black border lines',
      source: new ol.source.TileWMS({
        url: 'https://rsg.pml.ac.uk/geoserver/wms?',
        crossOrigin: null,
        params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line_black', SRS: this.map.getView().getProjection()},
      }),
    }));
    this.borderLayers.set('blue', new ol.layer.Tile({
      id: 'countries_all_blue',
      title: 'Blue border lines',
      source: new ol.source.TileWMS({
        url: 'https://rsg.pml.ac.uk/geoserver/wms?',
        crossOrigin: null,
        params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line', SRS: this.map.getView().getProjection()},
      }),
    }));
  }

  /**
    * Initialises the graticule, but does not make it visible.
    *
    * The graticule is made visible in the toggleGraticule() function.
    */
  createGraticule() {
    this.graticule = new ol.Graticule({
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
      this.graticule.setMap(this.map);
    } else {
      try {
        this.graticule.setMap();
      } catch (e) {
        console.error('Caught error when trying to call graticule.setMap() in function toggleGraticule().');
      }
    }
  }

  /**
    * Creates a new Key-Value Map containing the necessary Tile and View options
    * which are needed to display each basemap.
    *
    * When adding a new layer, the Key should be the title
    * of the base map, with the word 'Tile' or 'View' appended respectively.
    *
    * TODO maybe try and get the object-style version working - but
    * neither Nick could before.
    * (Object-style version can be found commented underneath the function).
    */
  createBaseLayers() {
    this.baseLayers = {};

    for (let layer of commonBasemaps) {
      this.baseLayers[layer.id] = {tile: {}, view: {}};

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
      this.baseLayers[layer.id].tile = new ol.layer.Tile({
        id: layer.id,
        title: layer.title,
        description: layer.description,
        projections: layer.projections,
        source: source,
      });
      this.baseLayers[layer.id].view = this.getViewSettings(layer.projections[0]);
    }
  }

  /**
    * Returns an OpenLayers View object with correct settings for
    * the specified projection.
    *
    * @param {String} projection The code for the projection (e.g. 'EPSG:4326')
    *
    * @return {ol.View} The View object with correct settings for the specified projection.
    */
  getViewSettings(projection) {
    switch (projection) {
      case 'EPSG:4326':
        return new ol.View({
          projection: 'EPSG:4326',
          center: ol.proj.fromLonLat([37.41, 8.82], 'EPSG:4326'),
          minZoom: 3,
          maxZoom: 12,
          zoom: 3,
        });
      case 'EPSG:3857':
        return new ol.View({
          projection: 'EPSG:3857',
          center: ol.proj.fromLonLat([37.41, 8.82], 'EPSG:3857'),
          minZoom: 3,
          maxZoom: 19,
          zoom: 3,
        });
    }
  }
}
/**
  * Creates all base layers to be used in createMap().
  * Object-style version

  baseLayers = {
    EOX: {
      Tile: [
        new ol.layer.Tile({
          id: 'EOX',
          title: 'EOX',
          description: 'EPSG:4326 only',
          projections: ['EPSG:4326'],
          source: new ol.source.TileWMS({
            url: 'https://tiles.maps.eox.at/wms/?',
            crossOrigin: null,
            params: {LAYERS: 'terrain-light', VERSION: '1.1.1', SRS: 'EPSG:4326', wrapDateLine: true},
          }),
        }),
      ],
      View: [
        new ol.View({
          center: ol.proj.fromLonLat([37.41, 8.82], 'EPSG:4326'),
          zoom: 4,
          projection: 'EPSG:4326',
        }),
      ],
    },

    OSM: {
      Tile: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
      ],
      View: [
        new ol.View({
          center: ol.proj.fromLonLat([37.41, 8.82]),
          zoom: 4,
        }),
      ],
    },
  };
  */

/**
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
