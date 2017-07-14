import L from 'leaflet';
import $ from 'jquery';

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

export function createMap(config) {
  let map = L.map(config.mapDivID, {
    crs: L.CRS.EPSG4326,
    center: [0, 0],
    zoom: 2,
    zoomControl: false,
  });

  L.tileLayer.wms('https://tiles.maps.eox.at/wms/', {
    layers: 'terrain-light',
    version: '1.1.1',
    attribution: 'EOX',
    crs: L.CRS.EPSG4326,
  }).addTo(map);

  // new CustomZoom({
  //   zoomInText: 'test',
  //   zoomOutText: '',
  //   position: 'topright',
  // }).addTo(map);

  L.control.zoom({
    zoomInText: '',
    zoomOutText: '',
    position: 'topright',
  }).addTo(map);
}
