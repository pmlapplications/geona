// import L from 'leaflet';

let L;

let map;

let baseLayers;

let mapLayers;

let mapLayersTracker = [];

export function init(next) {
  if (L) {
    // If leaflet has already been loaded
    next();
  } else {
    let head = document.getElementsByTagName('head')[0];
    let mapJs = document.createElement('script');
    mapJs.onload = function() {
      import('leaflet')
        .then((leaflet) => {
          L = leaflet;
          createBaseLayers();
          next();
          // setupZoom();
        });
    };
    mapJs.src = 'js/vendor_leaflet.js';
    head.appendChild(mapJs);
  }
}


/* function setupZoom() {
   L.Control.Zoom.include({
     onAdd: function(map) {
       let zoomName = 'leaflet-control-zoom';
       let container = L.DomUtil.create('div', zoomName + ' leaflet-bar');
       let options = this.options;

       this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
         zoomName + '-in', container, this._zoomIn);
       this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
         zoomName + '-out', container, this._zoomOut);

       this._updateDisabled();
       map.on('zoomend zoomlevelschange', this._updateDisabled, this);

       return container;
     },
   });
 }*/

// //


export function createMap(config) {
  if (!config.mapBaseMap) {
    config.mapBaseMap = 'EOX';
  }

  map = L.map(config.mapDivID, {
    crs: L.CRS.EPSG4326,
    center: [0, 0],
    zoom: 2,
    zoomControl: false,
    /* fullscreenControl: true,
    fullscreenControlOptions: {
      position: 'topright',
    },*/
  });

  mapLayers = L.layerGroup().addLayer(baseLayers.get(config.mapBaseMap)).addTo(map);
  mapLayersTracker.push(baseLayers.get(config.mapBaseMap));

  L.control.zoom({
    zoomInText: '<span class="icon-zoom-in"></span>',
    zoomOutText: '<span class="icon-zoom-out"></span>',
    position: 'topright',
  }).addTo(map);

  L.control.scale({
    metric: true,
    imperial: false,
    position: 'topright',
  }).addTo(map);


  removeBaseMap();
  addBaseMap('EOX');
  changeBaseMap('MCB');

  /* L.control.extend({
    position: 'topright',

    onAdd: function(map) {
      let fullscreenButton = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');

      fullscreenButton.style.backgroundColor = 'white';
      fullscreenButton.style.width = '40px';
      fullscreenButton.style.height = '33px';

      fullscreenButton.onclick = function() {

      };
    },
  }).addTo(map);*/
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
  mapLayers.removeLayer(mapLayersTracker[0]);
  mapLayersTracker.shift();
}

/**
 * Sets new base map layer and updates the layer tracker.
 * TODO test with multiple layers on map (function may be adding above existing layers)
 * @param {*} baseMap - the map portion of the Key in baseLayers.
 */
function addBaseMap(baseMap) {
  // If the map has no layers, we don't need to rearrange the mapLayers LayerGroup
  if (mapLayersTracker.length === 0) {
    mapLayers.addLayer(baseLayers.get(baseMap));
    mapLayersTracker.unshift(baseLayers.get(baseMap));
  } else {
    // Clear the LayerGroup, add the new base map at the start, then
    // loop through the tracker to add the rest
    mapLayers.clearLayers();
    mapLayers.addLayer(baseLayers.get(baseMap));
    for (let layer of mapLayersTracker) {
      mapLayers.addLayer(layer);
    }
  }
}

/**
 * Sets the config.mapBaseMap to the map's current base layer
 * TODO test with real config
 * @param {*} config
 */
function setConfigBaseMap(config) {
  config.mapBaseMap = mapLayersTracker[0];
}

/**
 * Creates a new Key-Value Map containing the necessary Tile and View options
 * which are needed to display each basemap.
 */
function createBaseLayers() {
  // Key-Value Map, not Leaflet map
  baseLayers = new Map();

  baseLayers.set('EOX', L.tileLayer.wms('https://tiles.maps.eox.at/wms/', {
    layers: 'terrain-light',
    version: '1.1.1',
    attribution: 'EOX',
    crs: L.CRS.EPSG4326,
  }));
  baseLayers.set('MCB', L.tileLayer.wms('http://vmap0.tiles.osgeo.org/wms/vmap0?', {
    layers: 'basic',
    version: '1.1.1',
    attribution: 'Metacarta Basic',
    crs: L.CRS.EPSG4326,
  })
  );
}

// new CustomZoom({
//   zoomInText: 'test',
//   zoomOutText: '',
//   position: 'topright',
// }).addTo(map);

/**
   * L.control.customZoom = L.Control.extend({
    options: {
      position: 'topright',
      customZoomtext: '<span class="icon-zoom-in"></span>',
      customZoomTitle: '<span class="icon-zoom-out"></span>',
    },

  }).addTo(map);
   */
