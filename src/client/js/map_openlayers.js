import $ from 'jquery';

let ol;
// baseLayers is an object containing the Tile and View information for
// various basemap types.
let baseLayers;

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
  let map = new ol.Map({
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
