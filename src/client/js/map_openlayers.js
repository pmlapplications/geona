import ol from 'openlayers';
import $ from 'jquery';

export function createMap() {
  let map = new ol.Map({
    target: 'map',
    controls: [
      new ol.control.Zoom({
        zoomInLabel: $('<span class="icon-zoom-in"></span>').appendTo('body'),
        zoomOutLabel: $('<span class="icon-zoom-out"></span>').appendTo('body'),
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
