import $ from 'jquery';

let ol;
// baseLayers is an object containing the Tile and View information for
// various basemap types.
let baseLayers;
let map;
let borderLayers;
let graticule;
let baseActive = false;
let borderActive = false;

export function init(next) {
  if (ol) {
    // If ol has already been loaded
    next();
  } else {
    let head = document.getElementsByTagName('head')[0];
    let mapJs = document.createElement('script');
    mapJs.onload = function() {
      import('openlayers')
        .then((openlayers) => {
          ol = openlayers;
          next();
        });
    };

    mapJs.src = 'js/vendor_openlayers.js';
    head.appendChild(mapJs);
  }
}

export function createMap(config) {
  createBaseLayers(config);
  map = new ol.Map({
    target: config.mapDivID,
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
  if (config.mapBaseMap) {
    map.addLayer(baseLayers.get(config.mapBaseMap + 'Tile'));
    map.setView(baseLayers.get(config.mapBaseMap + 'View'));
    baseActive = true;
  }

  createCountryBordersLayers();
  if (config.mapCountryBorders) {
    addCountryBordersLayer(config.mapCountryBorders);
  }

  createGraticule();
  if (config.mapGraticule === 'true') {
    toggleGraticule(config);
  }
}

/**
 * Will remove the current base map, and will add
 * the newly selected one.
 * To remove and not replace the current base map use
 * the removeBaseMap() function only.
 * @param {*} baseMap
 */
function changeBaseMap(baseMap) {
  removeBaseMap();
  addBaseMap(baseMap);
}

/**
 * Remove the current base map Layer.
 * TODO test with multiple layers on map (function may be removing ALL layers)
 */
function removeBaseMap() {
  map.removeLayer(map.getLayers().item(0));
  baseActive = false;
}

/**
 * Sets new base map layer, and updates the View.
 * TODO test with multiple layers on map (function may be adding above existing layers)
 * @param {*} baseMap - the map portion of the Key in baseLayers.
 */
function addBaseMap(baseMap) {
  map.getLayers().insertAt(0, baseLayers.get(baseMap + 'Tile'));
  map.setView(baseLayers.get(baseMap + 'View'));
  baseActive = true;
}

/**
 * Sets the config.mapBaseMap to the map's current base layer
 * TODO test with real config
 * @param {*} config
 */
function setConfigBaseMap(config) {
  config.mapBaseMap = map.getLayers().item(0);
}

function changeProjection(projection) {
  // If there is a base map
  if (baseActive === true) {
    let baseMapTitle = map.getLayers().item(0).get('title');
    // If base map supports new projection, we can change it
    if (baseLayers.get(baseMapTitle + 'Tile').get('projections').indexOf(projection) >= 0) {
      map.setView(getViewSettings(projection));
    } else {
      alert('Base map ' + baseMapTitle + ' does not support projection type ' + projection + '. Please select a different base map.');
    }
  }
}

/**
 *
 * @param {*} border -
 */
function changeCountryBordersLayer(border) {
  removeCountryBordersLayer();
  addCountryBordersLayer(border);
}

/**
 *
 * @param {*} border -
 */
function addCountryBordersLayer(border) {
  try {
    map.addLayer(borderLayers.get(border));
    borderActive = true;
  } catch (e) {
    // error will have occurred because the borders have not loaded,
    // or because the specified border does not exist.
    console.error(e);
  }
}

/**
 * 
 */
function removeCountryBordersLayer() {
  if (borderActive === true) {
    // Removes the top-most layer (border will always be on top)
    map.removeLayer(map.getLayers().item(map.getLayers().getLength() - 1));
    borderActive = false;
  }
}

function setConfigCountryBordersLayer(config) {
  if (borderActive === true) {
    // sets the config parameter to the top layer
    config.mapCountryBorders = map.getLayers().item(map.getLayers().getSize() - 1);
  }
}

/**
 *
 */
function createCountryBordersLayers() {
  // new Key-Value map, not OpenLayers map
  borderLayers = new Map();
  borderLayers.set('white', new ol.layer.Tile({
    id: 'countries_all_white',
    title: 'White border lines',
    source: new ol.source.TileWMS({
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line-white', SRS: map.getView().getProjection()},
    }),
  }));
  borderLayers.set('black', new ol.layer.Tile({
    id: 'countries_all_black',
    title: 'Black border lines',
    source: new ol.source.TileWMS({
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line_black', SRS: map.getView().getProjection()},
    }),
  }));
  borderLayers.set('blue', new ol.layer.Tile({
    id: 'countries_all_blue',
    title: 'Blue border lines',
    source: new ol.source.TileWMS({
      url: 'https://rsg.pml.ac.uk/geoserver/wms?',
      crossOrigin: null,
      params: {LAYERS: 'rsg:full_10m_borders', VERSION: '1.1.0', STYLES: 'line', SRS: map.getView().getProjection()},
    }),
  }));
}

/**
 * Initialises the graticule, but does not make it visible.
 */
function createGraticule() {
  graticule = new ol.Graticule({
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
function toggleGraticule(config) {
  if (config.mapGraticule) {
    graticule.setMap(map);
  } else {
    try {
      graticule.setMap();
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
function createBaseLayers(config) {
  baseLayers = new Map();

  baseLayers.set('EOXTile', new ol.layer.Tile({
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
  baseLayers.set('EOXView', getViewSettings('EPSG:4326'));

  baseLayers.set('OSMTile', new ol.layer.Tile({
    id: 'OSM',
    title: 'OSM',
    description: 'EPSG:3857 only',
    projections: ['EPSG:3857'],
    source: new ol.source.OSM(),
  }));
  baseLayers.set('OSMView', new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 4,
  }));

  baseLayers.set('GEBCOTile', new ol.layer.Tile({
    id: 'GEBCO',
    title: 'GEBCO',
    projections: ['EPSG:4326', 'EPSG:3857'],
    source: new ol.source.TileWMS({
      url: 'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?',
      crossOrigin: null,
      params: {LAYERS: 'gebco_08_grid', VERSION: '1.1.1', SRS: config.mapProjection, FORMAT: 'image/jpeg', wrapDateLine: true},
      attributions: ['GEBCO'],
    }),
  }));
  baseLayers.set('GEBCOView', getViewSettings(config.mapProjection));
}

function getViewSettings(projection) {
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
