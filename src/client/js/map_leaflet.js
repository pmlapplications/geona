import GeonaMap from './map';
import {baseLayers as commonBasemaps, borderLayers as commonBorders} from './map_common';

let L;

/**
 * @implements {GeonaMap}
 */
export class LMap extends GeonaMap {
  /**
   * Instantiate a new LMap and create a new Leaflet map
   * @param  {Object} config The map config to load
   */
  constructor(config) {
    super();
    // TODO this is only for testing
    window.LMap = this;
    /** @type {Object} The map config */
    this.config = config;
    this.initBaseLayers_();

    /** @type {L.map} The Leaflet map */
    this.map_ = L.map(this.config.divId, {
      crs: leafletizeProjection(this.config.projection),
      center: [0, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 13,
      zoomControl: false,
    });

    L.control.zoom({
      zoomInText: '<span class="icon-zoom-in"></span>',
      zoomOutText: '<span class="icon-zoom-out"></span>',
      position: 'topright',
    }).addTo(this.map_);

    L.control.scale({
      metric: true,
      imperial: false,
      position: 'topright',
    }).addTo(this.map_);

    if (this.config.basemap !== 'none') {
      this.setBasemap(this.config.basemap);
    }
  }

  /**
   * Set the basemap.
   * @param {String} basemap The id of the basemap to use, or 'none'
   */
  setBasemap(basemap) {
    if (this.config.basemap !== 'none' && this.config.basemap !== basemap) {
      this.baseLayers_[this.config.basemap].remove();
    }

    if (basemap !== 'none') {
      // TODO throw error if the provided basemap doesn't exist
      this.baseLayers_[basemap].addTo(this.map_).bringToBack();
    }

    this.config.basemap = basemap;
  }

  /**
   * Set the country borders to display, or none.
   * @param {String} borders The borders to display, or 'none'
   */
  setCountryBorders(borders) {
    // TODO
  }

  /**
   * Set the projection.
   * @param {String} projection The projection to use
   */
  setProjection(projection) {
    // This is a bit of a hack and isn't officially supported by leaflet. Everything may fall over!
    let LeafletProjection = leafletizeProjection(projection);
    let center = this.map_.getCenter();
    this.map_.options.crs = LeafletProjection;
    this.map_.setView(center);
    this.map_._resetView(this.map_.getCenter(), this.map_.getZoom(), true);
  }

  initBaseLayers_() {
    this.baseLayers_ = {};

    for (let layer of commonBasemaps) {
      this.baseLayers_[layer.id] = {};

      switch (layer.source.type) {
        case 'wms':
          this.baseLayers_[layer.id] = L.tileLayer.wms(layer.source.url, {
            layers: layer.source.params.LAYERS,
            version: layer.source.params.VERSION,
            attribution: layer.source.attributions,
          });
          break;
      }
    }
  }
}

/**
 * Adjust a provided OpenLayers style zoom level to be correct for leaflet.
 * @param  {Number} zoom OpenLayers style zoom level
 * @return {Number}      Leaflet style zoom level
 */
function leafletizeZoom(zoom) {
  // OpenLayers' zoom levels are one greater than Leaflet's for the same visible zoom
  return zoom - 1;
}

/**
 * Convert a projection string to a Leaflet CRS object
 * @param  {String} projection A projection string
 * @return {L.CRS}             A leaflet CRS object
 */
function leafletizeProjection(projection) {
  switch (projection) {
    case 'EPSG:3395':
      return L.CRS.EPSG3395;
    case 'EPSG:3857':
      return L.CRS.EPSG3857;
    case 'EPSG:4326':
      return L.CRS.EPSG4326;
    default:
      return null;
  }
}

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
          // createBaseLayers();
          // mapLayers = L.layerGroup();
          next();
          // setupZoom();
        });
    };
    mapJs.src = 'js/vendor_leaflet.js';
    head.appendChild(mapJs);
  }
}
