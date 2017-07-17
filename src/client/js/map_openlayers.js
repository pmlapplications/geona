import $ from 'jquery';

let ol;

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
  let map = new ol.Map({
    target: config.mapDivID,
    controls: [
      new ol.control.Zoom({
        // zoomInLabel: $('span.icon-zoom-in'),
        zoomInLabel: $('<span class="icon-zoom-in"></span>').appendTo('body')[0],
        zoomOutLabel: $('<span class="icon-zoom-out"></span>').appendTo('body')[0],
      }),
    ],
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 4,
    }),
  });
}
