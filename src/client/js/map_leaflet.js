// import L from 'leaflet';

let L;

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
          next();
          // setupZoom();
        });
    };
    mapJs.src = 'js/vendor_leaflet.js';
    head.appendChild(mapJs);
  }
}

// function setupZoom() {
//   L.Control.Zoom.include({
//     onAdd: function(map) {
//       let zoomName = 'leaflet-control-zoom';
//       let container = L.DomUtil.create('div', zoomName + ' leaflet-bar');
//       let options = this.options;

//       this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
//         zoomName + '-in', container, this._zoomIn);
//       this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
//         zoomName + '-out', container, this._zoomOut);

//       this._updateDisabled();
//       map.on('zoomend zoomlevelschange', this._updateDisabled, this);

//       return container;
//     },
//   });
// }

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

  /**
   * L.control.customZoom = L.Control.extend({
    options: {
      position: 'topright',
      customZoomtext: '<span class="icon-zoom-in"></span>',
      customZoomTitle: '<span class="icon-zoom-out"></span>',
    },

  }).addTo(map);
   */

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
}
