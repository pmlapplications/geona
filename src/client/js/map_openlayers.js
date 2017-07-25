import $ from 'jquery';

let ol;
// baseLayers is an object containing the Tile and View information for
// various basemap types.
// let baseLayers;
// let map;
// let borderLayers;
// let graticule;
// let baseActive = false;
// let borderActive = false;

export class GMap {
  constructor(config) {
    this.config = config;
    this.baseLayers = null;
    this.map = null;
    this.borderLayers = null;
    this.graticule = null;
    this.baseActive = false;
    this.borderActive = false;
  }

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
      this.map.addLayer(this.baseLayers.get(this.config.basemap + 'Tile'));
      this.map.setView(this.baseLayers.get(this.config.basemap + 'View'));
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
 * Will remove the current base map, and will add
 * the newly selected one.
 * To remove and not replace the current base map use
 * the removeBaseMap() function only.
 * @param {*} baseMap
 */
  changeBaseMap(baseMap) {
    this.removeBaseMap();
    this.addBaseMap(baseMap);
  }

  /**
 * Remove the current base map Layer.
 * TODO test with multiple layers on map (function may be removing ALL layers)
 */
  removeBaseMap() {
    this.map.removeLayer(this.map.getLayers().item(0));
    this.baseActive = false;
  }

  /**
 * Sets new base map layer, and updates the View.
 * TODO test with multiple layers on map (function may be adding above existing layers)
 * @param {*} baseMap - the map portion of the Key in baseLayers.
 */
  addBaseMap(baseMap) {
    this.map.getLayers().insertAt(0, this.baseLayers.get(baseMap + 'Tile'));
    this.map.setView(this.baseLayers.get(baseMap + 'View'));
    this.baseActive = true;
  }

  /**
 * Sets the this.config.basemap to the map's current base layer
 * TODO test with real config
 * @param {*} config
 */
  setConfigBaseMap() {
    this.config.basemap = this.map.getLayers().item(0);
  }

  changeProjection(projection) {
  // If there is a base map
    if (this.baseActive === true) {
      let baseMapTitle = this.map.getLayers().item(0).get('title');
      // If base map supports new projection, we can change it
      if (this.baseLayers.get(baseMapTitle + 'Tile').get('projections').indexOf(projection) >= 0) {
        this.map.setView(this.getViewSettings(projection));
      } else {
        alert('Base map ' + baseMapTitle + ' does not support projection type ' + projection + '. Please select a different base map.');
      }
    }
  }

  /**
 *
 * @param {*} border -
 */
  changeCountryBordersLayer(border) {
    this.removeCountryBordersLayer();
    this.addCountryBordersLayer(border);
  }

  /**
 *
 * @param {*} border -
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
 * 
 */
  removeCountryBordersLayer() {
    if (this.borderActive === true) {
    // Removes the top-most layer (border will always be on top)
      this.map.removeLayer(this.map.getLayers().item(this.map.getLayers().getLength() - 1));
      this.borderActive = false;
    }
  }

  setConfigCountryBordersLayer() {
    if (this.borderActive === true) {
    // sets the config parameter to the top layer
      this.config.countryBorders = this.map.getLayers().item(this.map.getLayers().getSize() - 1);
    }
  }

  /**
 *
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
 * @param {*} config
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
 * TODO maybe try and get the object-style version working - but neither Nick could before.
 * (Object-style version can be found commented underneath the function).
 */
  createBaseLayers() {
    this.baseLayers = new Map();

    this.baseLayers.set('EOXTile', new ol.layer.Tile({
      id: 'EOX',
      title: 'EOX',
      description: 'EPSG:4326 only',
      projections: ['EPSG:4326'],
      source: new ol.source.TileWMS({
        url: 'https://tiles.maps.eox.at/wms/?',
        crossOrigin: null,
        params: {LAYERS: 'terrain-light', VERSION: '1.1.1', SRS: 'EPSG:4326', wrapDateLine: true},
        attributions: ['EOX'],
      }),
    }));
    this.baseLayers.set('EOXView', this.getViewSettings('EPSG:4326'));

    this.baseLayers.set('OSMTile', new ol.layer.Tile({
      id: 'OSM',
      title: 'OSM',
      description: 'EPSG:3857 only',
      projections: ['EPSG:3857'],
      source: new ol.source.OSM(),
    }));
    this.baseLayers.set('OSMView', new ol.View({
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 4,
    }));

    this.baseLayers.set('GEBCOTile', new ol.layer.Tile({
      id: 'GEBCO',
      title: 'GEBCO',
      projections: ['EPSG:4326', 'EPSG:3857'],
      source: new ol.source.TileWMS({
        url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
        crossOrigin: null,
        params: {LAYERS: 'gebco_08_grid', VERSION: '1.1.1', SRS: this.config.projection, FORMAT: 'image/jpeg', wrapDateLine: true},
        attributions: ['GEBCO'],
      }),
    }));
    this.baseLayers.set('GEBCOView', this.getViewSettings(this.config.projection));
  }

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
