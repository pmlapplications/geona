import $ from 'jquery';

let ol;
// baseLayers is an object containing the Tile and View information for
// various basemap types.
let baseLayers;
let map;
let graticule;

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
          createBaseLayers();
          next();
        });
    };

    mapJs.src = 'js/vendor_openlayers.js';
    head.appendChild(mapJs);
  }
}

export function createMap(config) {
  // If mapBaseMap is undefined, set to EOX as default.
  if (!config.mapBaseMap) {
    config.mapBaseMap = 'EOX';
  }
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

    layers: [
      baseLayers.get(config.mapBaseMap + 'Tile'),
    ],

    view:
      baseLayers.get(config.mapBaseMap + 'View'),

  });
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
}

/**
 * Sets new base map layer, and updates the View.
 * TODO test with multiple layers on map (function may be adding above existing layers)
 * @param {*} baseMap - the map portion of the Key in baseLayers.
 */
function addBaseMap(baseMap) {
  map.getLayers().insertAt(0, baseLayers.get(baseMap + 'Tile'));
  map.setView(baseLayers.get(baseMap + 'View'));
}

/**
 * Sets the config.mapBaseMap to the map's current base layer
 * TODO test with real config
 * @param {*} config
 */
function setConfigBaseMap(config) {
  config.mapBaseMap = map.getLayers().item(0);
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
function createBaseLayers() {
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
    }),
  }));
  baseLayers.set('EOXView', new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82], 'EPSG:4326'),
    zoom: 4,
    projection: 'EPSG:4326',
  })
  );

  baseLayers.set('OSMTile', new ol.layer.Tile({
    source: new ol.source.OSM(),
  }),
  );
  baseLayers.set('OSMView', new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 4,
  }),
  );
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
  };*/
