import ol from 'openlayers';
import $ from 'jquery';

/**
 * g
 */
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
